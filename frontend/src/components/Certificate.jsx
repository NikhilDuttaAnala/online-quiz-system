import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Certificate = ({ userName, score, technology, level, date }) => {
  const certificateRef = useRef(null);

  const downloadCertificate = async () => {
    try {
      console.log('📜 Generating certificate...');
      
      const element = certificateRef.current;
      if (!element) {
        alert('Certificate element not found!');
        return;
      }

      // ✅ Make element visible temporarily
      element.style.position = 'fixed';
      element.style.left = '0';
      element.style.top = '0';
      element.style.zIndex = '9999';
      element.style.width = '1000px';
      element.style.height = '700px';
      element.style.background = 'white';
      
      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 200));

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });
      
      // Hide element again
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '-9999px';
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      pdf.save(`certificate-${userName || 'student'}.pdf`);
      
      console.log('✅ Certificate downloaded!');
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="text-center mt-6">
      {/* Certificate Design - Using ONLY SAFE colors */}
      <div 
        ref={certificateRef} 
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          top: '-9999px',
          width: '1000px',
          height: '700px',
          background: 'white'
        }}
      >
        <div style={{
          width: '1000px',
          height: '700px',
          background: 'white',
          padding: '48px',
          border: '8px solid #fbbf24',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}>
          <div style={{
            height: '100%',
            border: '4px solid #fbbf24',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff, #faf5ff)'
          }}>
            {/* Title */}
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: '#1e293b',
              fontFamily: 'cursive'
            }}>
              🏆 Certificate of Achievement
            </h1>
            
            {/* Divider */}
            <div style={{
              width: '128px',
              height: '4px',
              background: 'linear-gradient(to right, #2563eb, #7c3aed)',
              borderRadius: '999px',
              margin: '16px 0'
            }}></div>
            
            {/* Body */}
            <p style={{ fontSize: '20px', color: '#475569', marginTop: '16px' }}>
              This certifies that
            </p>
            <h2 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              color: '#4f46e5', 
              marginTop: '8px'
            }}>
              {userName || 'Student'}
            </h2>
            <p style={{ fontSize: '20px', color: '#475569', marginTop: '16px' }}>
              has successfully completed
            </p>
            <h3 style={{ 
              fontSize: '30px', 
              fontWeight: 'bold', 
              color: '#7c3aed', 
              marginTop: '8px'
            }}>
              {technology || 'Quiz'} - {level || 'Basic'} Level
            </h3>
            
            {/* Score Cards - Using inline styles */}
            <div style={{ 
              display: 'flex', 
              gap: '32px', 
              marginTop: '24px'
            }}>
              <div style={{
                background: '#f0fdf4',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #bbf7d0',
                textAlign: 'center',
                minWidth: '120px'
              }}>
                <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#16a34a' }}>
                  {score?.percentage || 0}%
                </p>
                <p style={{ fontSize: '14px', color: '#475569' }}>Score</p>
              </div>
              <div style={{
                background: '#eff6ff',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #bfdbfe',
                textAlign: 'center',
                minWidth: '120px'
              }}>
                <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#4f46e5' }}>
                  {score?.correct || 0}/{score?.total || 0}
                </p>
                <p style={{ fontSize: '14px', color: '#475569' }}>Correct Answers</p>
              </div>
            </div>
            
            {/* Date */}
            <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '32px' }}>
              📅 Date: {date || new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={downloadCertificate}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold shadow-lg hover:scale-105 transform transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400"
      >
        <span className="text-xl">📜</span>
        Download Certificate
      </button>
    </div>
  );
};

export default Certificate;