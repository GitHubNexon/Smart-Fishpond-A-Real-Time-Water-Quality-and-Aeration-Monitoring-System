'use client';

import React, { useRef } from 'react';

interface PrintWrapperProps {
  children: React.ReactNode;
  buttonText?: string;
  buttonClassName?: string;
  showButton?: boolean;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
}

export default function PrintWrapper({
  children,
  buttonText = 'Print',
  buttonClassName = 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors no-print',
  showButton = true,
  onBeforePrint,
  onAfterPrint,
}: PrintWrapperProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    // Call before print callback
    if (onBeforePrint) {
      onBeforePrint();
    }

    // Create iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';

    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Write the content to iframe
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Document</title>
          <meta charset="UTF-8">
          <style>
            * {
              box-sizing: border-box;
            }
            
            body {
              font-family: system-ui, -apple-system, sans-serif;
              margin: 0;
              padding: 0;
            }
            
            /* Hide elements with no-print class */
            .no-print {
              display: none !important;
            }
            
            /* Preserve padding and spacing */
            [class*="p-"], [class*="px-"], [class*="py-"], [class*="pt-"], [class*="pb-"], [class*="pl-"], [class*="pr-"] {
              padding: inherit !important;
            }
            
            [class*="m-"], [class*="mx-"], [class*="my-"], [class*="mt-"], [class*="mb-"], [class*="ml-"], [class*="mr-"] {
              margin: inherit !important;
            }
            
            /* Print-specific styles */
            @media print {
              .no-print {
                display: none !important;
              }
              
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
              
              @page {
                margin: 0.5in;
              }
            }
          </style>
          ${getPageStyles()}
        </head>
        <body>
          ${printRef.current?.innerHTML || ''}
        </body>
      </html>
    `);
    iframeDoc.close();

    // Wait for content to load, then print
    iframe.contentWindow?.focus();
    setTimeout(() => {
      iframe.contentWindow?.print();

      // Call after print callback
      if (onAfterPrint) {
        onAfterPrint();
      }

      // Clean up iframe after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);
    }, 250);
  };

  // Get all styles from the current page including Tailwind
  const getPageStyles = () => {
    let allStyles = '';

    // Get inline styles from style tags
    const styleTags = Array.from(document.querySelectorAll('style'));
    styleTags.forEach((tag) => {
      allStyles += tag.innerHTML + '\n';
    });

    // Get styles from stylesheets
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join('\n');
        } catch (e) {
          // Handle CORS issues with external stylesheets
          // Try to get the href and include as link
          if (styleSheet.href) {
            return '';
          }
          return '';
        }
      })
      .join('\n');

    allStyles += styles;

    // Get link tags for external stylesheets
    const links = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]'),
    )
      .map(
        (link) =>
          `<link rel="stylesheet" href="${(link as HTMLLinkElement).href}">`,
      )
      .join('\n');

    return `${links}<style>${allStyles}</style>`;
  };

  return (
    <div>
      {showButton && (
        <div className="mb-4 no-print">
          <button onClick={handlePrint} className={buttonClassName}>
            {buttonText}
          </button>
        </div>
      )}

      <div ref={printRef}>{children}</div>
    </div>
  );
}
