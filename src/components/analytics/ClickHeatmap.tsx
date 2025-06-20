import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { analyticsService } from '../../services/analyticsService';
import { BarChart3, MousePointer, Maximize2, Minimize2 } from 'lucide-react';

interface ClickHeatmapProps {
  className?: string;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const ClickHeatmap: React.FC<ClickHeatmapProps> = ({ 
  className = '',
  fullscreen = false,
  onToggleFullscreen
}) => {
  const { getCurrentDeviceCards } = useStore();
  
  const cards = getCurrentDeviceCards();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clickData, setClickData] = useState<Array<{x: number, y: number, intensity: number}>>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // Get click data from analytics service
    const loadClickData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch actual click data
        // For demo purposes, we'll generate random data
        const stats = analyticsService.getStats('pro');
        if (stats.clickHeatmap) {
          setClickData(stats.clickHeatmap);
        } else {
          // Generate demo data if no real data exists
          const demoData = generateDemoClickData();
          setClickData(demoData);
        }
      } catch (error) {
        console.error('Failed to load click data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClickData();

    // Handle resize
    const handleResize = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: container.clientHeight
          });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || clickData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw heatmap
    drawHeatmap(ctx, clickData, canvas.width, canvas.height);
  }, [clickData, dimensions]);

  const generateDemoClickData = () => {
    const demoData = [];
    // Generate random click data for demonstration
    for (let i = 0; i < 200; i++) {
      demoData.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        intensity: Math.random() * 0.8 + 0.2 // Random intensity between 0.2 and 1
      });
    }
    
    // Add some clusters to make it look more realistic
    for (let cluster = 0; cluster < 5; cluster++) {
      const centerX = Math.random() * dimensions.width;
      const centerY = Math.random() * dimensions.height;
      
      for (let i = 0; i < 30; i++) {
        demoData.push({
          x: centerX + (Math.random() - 0.5) * 100,
          y: centerY + (Math.random() - 0.5) * 100,
          intensity: Math.random() * 0.5 + 0.5
        });
      }
    }
    
    return demoData;
  };

  const drawHeatmap = (
    ctx: CanvasRenderingContext2D, 
    data: Array<{x: number, y: number, intensity: number}>,
    width: number,
    height: number
  ) => {
    // Create gradient
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 0, 0.6)');
    gradient.addColorStop(0.4, 'rgba(0, 255, 0, 0.4)');
    gradient.addColorStop(0.8, 'rgba(0, 0, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    // Draw each click point
    data.forEach(point => {
      const radius = 50 * point.intensity;
      
      ctx.save();
      ctx.translate(point.x, point.y);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = point.intensity * 0.7;
      ctx.fill();
      ctx.restore();
    });

    // Apply blur for smoother effect
    ctx.globalCompositeOperation = 'screen';
  };

  return (
    <div className={`relative ${className} ${fullscreen ? 'fixed inset-0 z-50 bg-gray-900/95 p-8 flex flex-col' : ''}`}>
      {!fullscreen && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <MousePointer size={20} className="text-pink-400" />
            Heatmap des clics
          </h3>
          
          {onToggleFullscreen && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleFullscreen}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Maximize2 size={16} />
            </motion.button>
          )}
        </div>
      )}
      
      {fullscreen && onToggleFullscreen && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <MousePointer size={24} className="text-pink-400" />
            Heatmap des clics
          </h3>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <Minimize2 size={20} />
          </motion.button>
        </div>
      )}
      
      <div className={`relative w-full ${fullscreen ? 'flex-grow' : 'h-64 md:h-80'} bg-gray-900/50 rounded-xl overflow-hidden border border-white/10`}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full"
            />
          </div>
        ) : clickData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-400">Aucune donnée de clic disponible</p>
            </div>
          </div>
        ) : (
          <canvas 
            ref={canvasRef}
            className="w-full h-full"
          />
        )}
        
        {!isLoading && clickData.length > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {clickData.length} clics
          </div>
        )}
      </div>
      
      {!fullscreen && (
        <div className="mt-2 text-xs text-gray-400">
          Cette visualisation montre où les utilisateurs cliquent le plus sur votre grille.
          Les zones rouges indiquent une concentration élevée de clics.
        </div>
      )}
    </div>
  );
};