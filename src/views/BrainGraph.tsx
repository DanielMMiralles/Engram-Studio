import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GraphNode } from '../types';

export const BrainGraph: React.FC = () => {
  const { graphData, setSelectedNode, selectedNode, searchQuery, lang } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [latestNeuronNotice, setLatestNeuronNotice] = useState<string | null>(null);

  const simNodesRef = useRef<any[]>([]);
  const simLinksRef = useRef<any[]>([]);

  useEffect(() => {
    const width = 1000;
    const height = 700;
    const center = { x: width / 2, y: height / 2 };
    
    simNodesRef.current = graphData.nodes.map((node, i) => {
      const angle = (i / Math.max(graphData.nodes.length, 1)) * 2 * Math.PI;
      const radius = 180 + (i % 3) * 60;
      return {
        ...node,
        x: center.x + radius * Math.cos(angle) + (Math.random() - 0.5) * 40,
        y: center.y + radius * Math.sin(angle) + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0
      };
    });
    simLinksRef.current = [...graphData.links];
  }, [graphData]);

  // Listen for real-time new neurons added by VaultWatcher
  useEffect(() => {
    if ((window as any).devbrainApi?.onNodeAdded) {
      const unsubscribe = (window as any).devbrainApi.onNodeAdded((data: { node: any; links: any[] }) => {
        const center = { x: 500, y: 350 };
        const newNode = {
          ...data.node,
          x: center.x + (Math.random() - 0.5) * 200,
          y: center.y + (Math.random() - 0.5) * 200,
          vx: 0,
          vy: 0,
          isNew: true,
          birthTime: Date.now()
        };

        // Add to simulation
        simNodesRef.current = [...simNodesRef.current.filter(n => n.id !== newNode.id), newNode];
        simLinksRef.current = [...simLinksRef.current, ...data.links];

        setLatestNeuronNotice(`✨ Nueva neurona aprendida: "${newNode.label}"`);
        setTimeout(() => setLatestNeuronNotice(null), 5000);
      });

      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      const nodes = simNodesRef.current;
      const nodeMap = new Map<string, any>(nodes.map(n => [n.id, n]));

      // 1. Draw Synaptic Links
      for (const link of simLinksRef.current) {
        const source = nodeMap.get(link.source);
        const target = nodeMap.get(link.target);
        if (source && target) {
          const isConnected = selectedNode && (selectedNode.id === source.id || selectedNode.id === target.id);
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = isConnected 
            ? 'rgba(88, 166, 255, 0.7)' 
            : 'rgba(56, 139, 253, 0.18)';
          ctx.lineWidth = isConnected ? 2 : 1;
          ctx.stroke();

          // Animated signal particle
          if (isConnected) {
            const t = (Date.now() % 2000) / 2000;
            const px = source.x + (target.x - source.x) * t;
            const py = source.y + (target.y - source.y) * t;
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, 2 * Math.PI);
            ctx.fillStyle = '#58a6ff';
            ctx.shadowColor = '#58a6ff';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // 2. Draw Neural Nodes
      const now = Date.now();
      for (const node of nodes) {
        const isMatch = searchQuery 
          ? node.label.toLowerCase().includes(searchQuery.toLowerCase()) 
          : true;
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;

        const baseRadius = (node.val || 5) * 2 + 6;
        const radius = isSelected ? baseRadius * 1.3 : baseRadius;

        // Shockwave expansion animation for newly born neurons (<4 seconds old)
        if (node.isNew && (now - node.birthTime) < 4000) {
          const ageRatio = (now - node.birthTime) / 4000;
          const waveRadius = radius + ageRatio * 35;
          ctx.beginPath();
          ctx.arc(node.x, node.y, waveRadius, 0, 2 * Math.PI);
          ctx.strokeStyle = `rgba(46, 160, 67, ${1 - ageRatio})`;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Outer Glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 4, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected 
          ? 'rgba(88, 166, 255, 0.4)' 
          : `${node.color || '#388bfd'}22`;
        ctx.fill();

        // Node Body
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = isMatch ? (node.color || '#388bfd') : '#30363d';
        ctx.shadowColor = isMatch ? (node.color || '#388bfd') : 'transparent';
        ctx.shadowBlur = isSelected ? 16 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner core
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 0.4, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Label
        if (zoom > 0.7 || isSelected || isHovered || isMatch) {
          ctx.font = isSelected ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
          ctx.fillStyle = isSelected ? '#ffffff' : (isMatch ? '#e6edf3' : '#6e7681');
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y + radius + 14);
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [pan, zoom, selectedNode, hoveredNode, searchQuery]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    } else {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;

      const found = simNodesRef.current.find(n => {
        const dx = n.x - mouseX;
        const dy = n.y - mouseY;
        return Math.sqrt(dx * dx + dy * dy) < ((n.val || 5) * 2 + 8);
      });
      setHoveredNode(found || null);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    if (hoveredNode) {
      setSelectedNode(hoveredNode);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#090d13] overflow-hidden flex flex-col select-none">
      {/* Real-time New Neuron Notification Banner */}
      {latestNeuronNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-accent-green/20 border border-accent-green/40 backdrop-blur px-4 py-2 rounded-xl text-xs text-accent-green font-medium flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 animate-spin text-accent-green" />
          <span>{latestNeuronNotice}</span>
          <button onClick={() => setLatestNeuronNotice(null)} className="hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-1 bg-surface/90 backdrop-blur border border-border p-1 rounded-xl shadow-lg">
          {['all', 'patrones', 'backend', 'proyectos', 'aprendizajes'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs capitalize font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? (lang === 'es' ? 'Todas' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Zoom Controls */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
        <div className="flex flex-col bg-surface/90 backdrop-blur border border-border p-1 rounded-xl shadow-xl">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.2, 3))}
            className="p-2 text-gray-400 hover:text-white hover:bg-surface-light rounded-lg transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.2, 0.3))}
            className="p-2 text-gray-400 hover:text-white hover:bg-surface-light rounded-lg transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="p-2 text-gray-400 hover:text-white hover:bg-surface-light rounded-lg transition-all"
            title="Reset View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
