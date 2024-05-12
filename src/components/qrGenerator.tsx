import React from 'react';
import { useQRCode } from 'next-qrcode';

function QR(props:{text:string}) {
  const { Canvas } = useQRCode();

  return (
    <div className='flex justify-center'><Canvas
      text={props.text}
      options={{
        errorCorrectionLevel: 'M',
        // margin: 3,
        quality: 1,
        scale: 4,
        width: 150,
        color: {
          dark: '#000',
        //   light: '#FFBF60FF',
        },
      }}
    />
    </div>
  );
}

export default QR;