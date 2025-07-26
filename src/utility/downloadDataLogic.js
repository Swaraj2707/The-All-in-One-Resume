import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
export const handleDownload = async () => {
    const element = resumeRef.current;
    const canvas = await html2canvas(element);
    const dataURL = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgProperties = pdf.getImageProperties(dataURL);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(dataURL, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Resume.pdf');
    dynamicNavigation("/thank-you")
  };