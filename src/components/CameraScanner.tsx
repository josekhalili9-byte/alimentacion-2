import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';
import { motion } from 'motion/react';

interface CameraScannerProps {
  onCapture: (base64Image: string, mimeType: string) => void;
}

export default function CameraScanner({ onCapture }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('NotSupportedError');
      }

      // Check permission status if API is available
      if (navigator.permissions && (navigator.permissions as any).query) {
        try {
          const status = await (navigator.permissions as any).query({ name: 'camera' });
          if (status.state === 'denied') {
            setCameraError("Acceso bloqueado. Por favor, haz clic en el icono del candado 🔒 en la barra de direcciones y cambia el permiso de cámara a 'Permitir'.");
            return;
          }
        } catch (e) {
          // Ignore permission query errors
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          setIsCameraActive(true);
        };
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError("Permiso denegado. Por favor, permite el acceso a la cámara en la configuración de tu navegador y recarga la página.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError' || err.message === 'NotSupportedError') {
        setCameraError("No se encontró ninguna cámara o tu navegador no es compatible.");
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError("La cámara está siendo usada por otra aplicación.");
      } else {
        setCameraError("Error al acceder a la cámara. Por favor, intenta subir una foto.");
      }
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && videoRef.current.readyState === 4) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      
      // Resize logic to prevent QuotaExceededError in localStorage
      const MAX_DIMENSION = 800;
      let width = video.videoWidth;
      let height = video.videoHeight;

      if (width > height) {
        if (width > MAX_DIMENSION) {
          height *= MAX_DIMENSION / width;
          width = MAX_DIMENSION;
        }
      } else {
        if (height > MAX_DIMENSION) {
          width *= MAX_DIMENSION / height;
          height = MAX_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw the current frame resized
        ctx.drawImage(video, 0, 0, width, height);
        
        try {
          // Lower quality to 0.7 to save space
          const base64Image = canvas.toDataURL('image/jpeg', 0.7);
          stopCamera();
          onCapture(base64Image, 'image/jpeg');
        } catch (e) {
          console.error("Error capturing image data:", e);
          setCameraError("Error al procesar la imagen. Intenta de nuevo.");
        }
      }
    } else {
      setCameraError("La cámara no está lista. Por favor espera un momento.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onCapture(reader.result, file.type);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (isCameraActive) {
    return (
      <div className="relative w-full h-[60vh] bg-black rounded-2xl overflow-hidden shadow-xl">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6">
          <button 
            onClick={stopCamera}
            className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <X size={24} />
          </button>
          <button 
            onClick={capturePhoto}
            className="w-20 h-20 bg-white rounded-full border-4 border-emerald-500 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          >
            <div className="w-16 h-16 bg-emerald-500 rounded-full" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 text-center"
    >
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
        <Camera size={40} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Escáner de Alimentos</h2>
      <p className="text-slate-500 mb-8 max-w-xs">
        Toma una foto de tu comida para analizar su valor nutricional al instante.
      </p>
      
      <div className="flex flex-col w-full gap-4">
        <button 
          onClick={startCamera}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-semibold text-lg shadow-md shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
        >
          <Camera size={24} />
          Escanear Alimento
        </button>
        
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">o</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
        >
          <ImageIcon size={24} />
          Subir Foto
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      {cameraError && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
          <p className="text-red-600 text-sm mb-4 font-medium">{cameraError}</p>
          <div className="flex flex-col gap-2">
            <button 
              onClick={startCamera}
              className="text-emerald-600 text-sm font-semibold hover:underline"
            >
              Intentar de nuevo
            </button>
            <p className="text-slate-400 text-xs italic">
              Tip: Haz clic en el icono del candado 🔒 en la barra de direcciones para habilitar la cámara.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
