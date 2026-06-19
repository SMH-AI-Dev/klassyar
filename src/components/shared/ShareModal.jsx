import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Download, Share2, Mail, Copy, Check, QrCode, Printer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function ShareModal({ activity, onClose }) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showQR, setShowQR] = useState(false);
  const printRef = useRef();

  // Generate share URL
  const shareUrl = `${window.location.origin}/Play?id=${activity.id}&type=${activity.type}`;

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Generate QR Code
  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(shareUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#6366f1',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(url);
      setShowQR(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  // Share via Gmail
  const shareViaGmail = () => {
    const subject = encodeURIComponent(`دعوت به بازی: ${activity.title}`);
    const body = encodeURIComponent(`
سلام!

من یک فعالیت جذاب در کلاس یار ساختم و دوست دارم با تو به اشتراک بگذارم:

📝 عنوان: ${activity.title}
🎮 نوع: ${getActivityTypeName(activity.type)}
${activity.description ? `📄 توضیحات: ${activity.description}` : ''}

برای بازی کلیک کن: ${shareUrl}

موفق باشی! 🎉
    `);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
  };

  // Print activity
  const handlePrint = () => {
    window.print();
  };

  // Export as PDF
  const exportPDF = async () => {
    try {
      const element = printRef.current || document.querySelector('.activity-content');
      if (!element) {
        alert('محتوا برای تبدیل به PDF یافت نشد');
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${activity.title || 'activity'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('خطا در ساخت PDF');
    }
  };

  // Download QR Code
  const downloadQR = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-${activity.title || 'activity'}.png`;
    link.click();
  };

  const getActivityTypeName = (type) => {
    const names = {
      flashcard: 'کارت‌های آموزشی',
      quiz: 'آزمون',
      matching: 'جورکردنی',
      group_sort: 'مرتب‌سازی گروهی',
      memory_game: 'بازی حافظه',
      random_wheel: 'چرخ گردان',
      true_false: 'درست یا غلط',
      unjumble: 'ترتیب کلمات',
      whack_a_mole: 'بزن بزن',
      wordsearch: 'پیدا کردن کلمه'
    };
    return names[type] || type;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl clay-element max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-purple-200/50 flex items-center justify-between sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Share2 className="w-6 h-6 text-purple-600" />
                اشتراک‌گذاری فعالیت
              </h2>
              <p className="text-gray-600 mt-1">{activity.title}</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="rounded-full clay-element"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Share URL */}
            <Card className="clay-element bg-purple-50 border-0">
              <CardContent className="p-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  لینک اشتراک‌گذاری
                </label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="rounded-xl clay-element bg-white"
                  />
                  <Button
                    onClick={handleCopy}
                    className="rounded-xl clay-element"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={shareViaGmail}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl clay-element h-14"
              >
                <Mail className="w-5 h-5 ml-2" />
                ارسال با Gmail
              </Button>

              <Button
                onClick={generateQR}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl clay-element h-14"
              >
                <QrCode className="w-5 h-5 ml-2" />
                QR Code
              </Button>

              <Button
                onClick={handlePrint}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl clay-element h-14"
              >
                <Printer className="w-5 h-5 ml-2" />
                چاپ
              </Button>

              <Button
                onClick={exportPDF}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl clay-element h-14"
              >
                <Download className="w-5 h-5 ml-2" />
                ذخیره PDF
              </Button>
            </div>

            {/* QR Code Display */}
            {showQR && qrCodeUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Card className="clay-element bg-white border-2 border-purple-300">
                  <CardContent className="p-6">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="mx-auto mb-4 rounded-2xl"
                    />
                    <p className="text-sm text-gray-600 mb-4">
                      برای اشتراک‌گذاری این QR Code را اسکن کنید
                    </p>
                    <Button
                      onClick={downloadQR}
                      variant="outline"
                      className="rounded-xl clay-element"
                    >
                      <Download className="w-4 h-4 ml-2" />
                      دانلود QR Code
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Activity Preview for Print */}
            <div ref={printRef} className="hidden print:block activity-content p-8 bg-white">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{activity.title}</h1>
                <p className="text-gray-600">{getActivityTypeName(activity.type)}</p>
                {activity.description && (
                  <p className="text-gray-700 mt-4">{activity.description}</p>
                )}
              </div>
              
              {/* Activity Content */}
              <div className="border-2 border-gray-300 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">محتوای فعالیت:</h3>
                {/* Add activity-specific content rendering here */}
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(activity.content, null, 2)}
                </pre>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-gray-500 border-t pt-4">
                <p>ساخته شده با ❤️ در کلاس یار</p>
                <p className="mt-2">برای بازی آنلاین: {shareUrl}</p>
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="QR" className="w-32 h-32 mx-auto mt-4" />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
