
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

export const exportToPDF = async (
  transactions: any[],
  currentMonth: Date,
  userName: string,
) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const monthYear = format(currentMonth, "MMMM yyyy");

  // 1. Header Information
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59); 
  doc.text("Monthly Financial Report", 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(100);
 let y = 30;

doc.text(`User: ${userName}`, 14, y);
y += 6;

doc.text(`Period: ${monthYear}`, 14, y);
y += 6;

doc.text(`Generated: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, y);


  // 2. Data Processing
  const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const totalSavings = transactions.filter(t => t.type === "savings").reduce((acc, t) => acc + t.amount, 0);

  const tableData = transactions.map((tx) => [
    format(new Date(tx.date), "dd/MM/yyyy"),
    tx.description || tx.category,
    tx.type.toUpperCase(),
    tx.source || "Balance",
    `Rs. ${tx.amount.toLocaleString("en-IN")}`,
  ]);

  // 3. Render Table with Conditional Row Coloring
  autoTable(doc, {
    startY: 45,
    head: [["Date", "Description", "Type", "Source", "Amount"]],
    body: tableData,
    foot: [
      ["", "", "", "TOTAL INCOME", `Rs. ${totalIncome.toLocaleString("en-IN")}`],
      ["", "", "", "TOTAL EXPENSE", `Rs. ${totalExpense.toLocaleString("en-IN")}`],
      ["", "", "", "TOTAL SAVINGS", `Rs. ${totalSavings.toLocaleString("en-IN")}`],
    ],
    headStyles: { fillColor: [79, 70, 229] },
    footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
    didParseCell: (data) => {
      if (data.section === 'body') {
        const type = data.row.cells[2].text[0];
        if (type === 'INCOME') data.cell.styles.textColor = [16, 185, 129];
        else if (type === 'EXPENSE') data.cell.styles.textColor = [239, 68, 68];
        else if (type === 'SAVINGS') data.cell.styles.textColor = [245, 158, 11];
      }
    },
  });

  // 4. Professional Chart Section with Amounts and Percentages
  const expenseData = transactions.filter(t => t.type === 'expense');
  const categories: { [key: string]: number } = {};
  expenseData.forEach(t => { categories[t.category] = (categories[t.category] || 0) + t.amount; });

  const labels = Object.keys(categories);
  const values = Object.values(categories);

  if (labels.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text("Expense Breakdown by Category", 14, 20);

    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 500;
    canvas.style.visibility = 'hidden';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: '#6366f1',
          borderRadius: 8,
          barThickness: 45,
        }]
      },
      options: {
        devicePixelRatio: 2,
        responsive: false,
        animation: false,
        layout: { padding: { top: 40, bottom: 20 } },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'top',
            // Display Amount and Percentage
            formatter: (value) => {
              const percentage = ((value / totalExpense) * 100).toFixed(1);
              return `₹${value.toLocaleString('en-IN')}\n(${percentage}%)`;
            },
            font: { weight: 'bold', size: 11 },
            color: '#475569',
            textAlign: 'center'
          }
        },
        scales: {
          y: { 
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { callback: (value) => '₹' + value.toLocaleString('en-IN') } 
          },
          x: { grid: { display: false } }
        }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 150));
    const chartImg = canvas.toDataURL('image/png', 1.0);
    doc.addImage(chartImg, 'PNG', 15, 30, 180, 95);
    
    chart.destroy();
    document.body.removeChild(canvas);
  }

  // 5. Final Save
  doc.save(`Spendly_Report_${monthYear.replace(" ", "_")}.pdf`);
};