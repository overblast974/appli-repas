import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { MealPlan } from '../types';

/**
 * Service d'export et de partage des plans de repas
 */
export const exportService = {
  /**
   * Générer un PDF du plan de repas
   */
  generatePDF(mealPlan: MealPlan): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94); // Couleur primaire
    doc.text('NutriPlan - Planning Alimentaire', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Durée: ${mealPlan.duration} jour${mealPlan.duration > 1 ? 's' : ''}`, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 5;
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, yPosition, { align: 'center' });

    // Résumé nutritionnel global
    yPosition += 15;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Objectifs nutritionnels quotidiens', 14, yPosition);

    yPosition += 8;
    doc.setFontSize(10);
    const { adjustedCalories, macros } = mealPlan.metabolicResults;
    doc.text(`• Calories: ${adjustedCalories} kcal/jour`, 20, yPosition);
    yPosition += 6;
    doc.text(`• Protéines: ${Math.round(macros.protein)}g`, 20, yPosition);
    yPosition += 6;
    doc.text(`• Glucides: ${Math.round(macros.carbs)}g`, 20, yPosition);
    yPosition += 6;
    doc.text(`• Lipides: ${Math.round(macros.fats)}g`, 20, yPosition);

    // Générer chaque jour
    mealPlan.dailyPlans.forEach((day, index) => {
      // Nouvelle page pour chaque jour sauf le premier
      if (index > 0) {
        doc.addPage();
        yPosition = 20;
      } else {
        yPosition += 15;
      }

      // Titre du jour
      doc.setFontSize(14);
      doc.setTextColor(34, 197, 94);
      const dayDate = new Date(day.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      doc.text(`Jour ${index + 1} - ${dayDate}`, 14, yPosition);

      yPosition += 8;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Calories totales: ${Math.round(day.totalNutrition.calories)} kcal (Écart: ${(day.deviation * 100).toFixed(1)}%)`, 14, yPosition);

      // Tableau des repas
      yPosition += 5;
      const tableData = day.meals.map((meal) => [
        this.getMealTypeLabel(meal.type),
        meal.name,
        `${Math.round(meal.nutrition.calories)} kcal`,
        `${Math.round(meal.nutrition.macros.protein)}g`,
        `${Math.round(meal.nutrition.macros.carbs)}g`,
        `${Math.round(meal.nutrition.macros.fats)}g`,
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Type', 'Repas', 'Calories', 'Protéines', 'Glucides', 'Lipides']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [34, 197, 94],
          textColor: [255, 255, 255],
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 9,
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 25 },
          3: { cellWidth: 22 },
          4: { cellWidth: 22 },
          5: { cellWidth: 22 },
        },
      });

      // Ajouter les ingrédients de chaque repas
      const finalY = (doc as any).lastAutoTable.finalY || yPosition + 40;
      yPosition = finalY + 10;

      day.meals.forEach((meal) => {
        // Vérifier si on a assez d'espace, sinon nouvelle page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`${this.getMealTypeLabel(meal.type)} - ${meal.name}`, 14, yPosition);
        yPosition += 6;

        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        meal.ingredients.forEach((ingredient) => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          const qty = Math.round(ingredient.quantity * meal.multiplier * 10) / 10;
          doc.text(`  • ${ingredient.name}: ${qty} ${ingredient.unit}`, 20, yPosition);
          yPosition += 5;
        });
        yPosition += 5;
      });
    });

    // Pied de page sur la dernière page
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} sur ${pageCount} - NutriPlan © ${new Date().getFullYear()}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    // Télécharger le PDF
    const filename = `nutriplan-${mealPlan.duration}jours-${new Date().getTime()}.pdf`;
    doc.save(filename);
  },

  /**
   * Partager le plan de repas
   */
  async shareMealPlan(mealPlan: MealPlan): Promise<void> {
    const shareData = {
      title: 'Mon Planning Alimentaire NutriPlan',
      text: `Planning alimentaire personnalisé de ${mealPlan.duration} jour${mealPlan.duration > 1 ? 's' : ''}\n` +
            `Objectif: ${mealPlan.metabolicResults.adjustedCalories} kcal/jour\n` +
            `Protéines: ${Math.round(mealPlan.metabolicResults.macros.protein)}g | ` +
            `Glucides: ${Math.round(mealPlan.metabolicResults.macros.carbs)}g | ` +
            `Lipides: ${Math.round(mealPlan.metabolicResults.macros.fats)}g`,
      url: window.location.href,
    };

    try {
      // Utiliser l'API Web Share si disponible (mobile principalement)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copier dans le presse-papier
        const textToCopy = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
        await navigator.clipboard.writeText(textToCopy);
        alert('Le lien a été copié dans votre presse-papier !');
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      // Fallback final: copier juste l'URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Le lien a été copié dans votre presse-papier !');
      } catch (clipboardError) {
        console.error('Erreur lors de la copie:', clipboardError);
        alert('Impossible de partager. Veuillez copier manuellement l\'URL.');
      }
    }
  },

  /**
   * Obtenir le label d'un type de repas
   */
  getMealTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      breakfast: 'Petit-déjeuner',
      lunch: 'Déjeuner',
      dinner: 'Dîner',
      snack: 'Collation',
    };
    return labels[type] || type;
  },
};
