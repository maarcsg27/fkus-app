import React, { useState, useEffect, useRef } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { parseVoiceInput, ParsedVoiceResult } from '../../utils/voiceParser';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  X, 
  CheckSquare, 
  Target, 
  Zap, 
  Calendar, 
  Clock, 
  Tag, 
  AlertCircle, 
  Plus, 
  Trash2, 
  ArrowRight,
  HelpCircle,
  Check
} from 'lucide-react';
import { IconRenderer } from './IconRenderer';
import confetti from 'canvas-confetti';

interface VoiceCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceCaptureModal: React.FC<VoiceCaptureModalProps> = ({ isOpen, onClose }) => {
  const { 
    categories, 
    addTask, 
    addGoal, 
    addRoutine, 
    setActiveTab 
  } = useFKUS();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [parsed, setParsed] = useState<ParsedVoiceResult | null>(null);
  const [activeType, setActiveType] = useState<'task' | 'goal' | 'routine'>('task');
  
  // Editable form fields
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>(undefined);
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [targetDate, setTargetDate] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [newStepText, setNewStepText] = useState('');
  const [showTips, setShowTips] = useState(false);

  const recognitionRef = useRef<any>(null);

  const defaultCatId = categories[0]?.id || '1';

  // Initialize Speech Recognition
  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const recognition = new SpeechRec();
      recognition.lang = 'es-ES';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        currentTranscript = currentTranscript.trim();
        setTranscript(currentTranscript);
        analyzeText(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechSupported(false);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      // Auto start listening on open
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Auto-start speech error:', e);
      }
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, [isOpen]);

  // Analyze text and populate editable fields
  const analyzeText = (text: string) => {
    if (!text.trim()) return;
    const res = parseVoiceInput(text, categories, defaultCatId);
    setParsed(res);
    setActiveType(res.type);
    setTitle(res.title);
    setDate(res.date || '');
    setTime(res.time || '');
    setDurationMinutes(res.durationMinutes);
    setCategoryId(res.categoryId || defaultCatId);
    setPriority(res.priority);
    setTargetDate(res.targetDate || '');
    setSteps(res.steps || []);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {}
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {}
    }
  };

  const handleManualTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setTranscript(text);
    analyzeText(text);
  };

  const handleAddStep = () => {
    if (!newStepText.trim()) return;
    setSteps([...steps, newStepText.trim()]);
    setNewStepText('');
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) return;

    if (activeType === 'task') {
      addTask({
        title: title.trim(),
        date: date || undefined,
        time: time || undefined,
        durationMinutes: durationMinutes || undefined,
        categoryId: categoryId || defaultCatId,
        priority: priority,
        subtasks: steps.map((s, idx) => ({
          id: `sub-${Date.now()}-${idx}`,
          taskId: '',
          title: s,
          completed: false
        }))
      });
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      onClose();
    } else if (activeType === 'goal') {
      addGoal({
        title: title.trim(),
        targetDate: targetDate || new Date().toISOString().slice(0, 10),
        categoryId: categoryId || defaultCatId,
        priority: priority,
      });
      setActiveTab('goals');
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 } });
      onClose();
    } else if (activeType === 'routine') {
      addRoutine({
        title: title.trim(),
        time: time || '08:00',
        categoryId: categoryId || defaultCatId,
        recurrence: { type: 'daily' },
        isActive: true,
        steps: steps.map((s, idx) => ({
          id: `step-${Date.now()}-${idx}`,
          title: s,
          durationMinutes: 10
        }))
      });
      setActiveTab('tasks');
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 } });
      onClose();
    }
  };

  const handleSampleClick = (sample: string) => {
    setTranscript(sample);
    analyzeText(sample);
    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  const currentCategory = categories.find(c => c.id === categoryId);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-5 duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-black/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 text-red-500 flex items-center justify-center shadow-sm">
              <Sparkles size={17} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-tight">Captura por Voz Inteligente</h3>
              <p className="text-[10px] text-neutral-400">Habla con naturalidad y FKUS detectará todos los parámetros.</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setShowTips(!showTips)}
              className={`p-1.5 rounded-lg border transition-colors ${
                showTips ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Ver ejemplos de comandos de voz"
            >
              <HelpCircle size={16} />
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Audio Pulsating Bar & Microphone Button */}
          <div className="flex flex-col items-center justify-center py-4 bg-gradient-to-b from-neutral-900/40 to-neutral-950 rounded-2xl border border-neutral-800/80 relative overflow-hidden">
            {/* Pulsating animated rings */}
            <div className="relative mb-3">
              {isListening && (
                <span className="absolute inset-0 rounded-full bg-red-600/40 animate-ping" />
              )}
              <button
                type="button"
                onClick={toggleListening}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-xl relative z-10 ${
                  isListening
                    ? 'bg-gradient-to-tr from-red-600 to-rose-500 text-white scale-105 shadow-red-600/40 ring-4 ring-red-500/30'
                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-700'
                }`}
              >
                {isListening ? <Mic size={28} className="animate-pulse" /> : <MicOff size={26} />}
              </button>
            </div>

            <p className="text-xs font-bold text-neutral-200">
              {isListening ? 'Escuchando... Di lo que tienes que hacer' : 'Toca el micrófono para empezar a dictar'}
            </p>
            <p className="text-[10.5px] text-neutral-400 mt-0.5">
              Ej: "Mañana a las 18:00 gimnasio durante 1 hora con pasos: calentar, pesas y cardio"
            </p>
          </div>

          {/* Transcript / Input Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 px-1">
              <span>Texto dictado o escrito:</span>
              {transcript && (
                <button 
                  onClick={() => { setTranscript(''); setParsed(null); }}
                  className="text-[10px] text-red-400 hover:underline"
                >
                  Borrar
                </button>
              )}
            </div>
            <textarea
              value={transcript}
              onChange={handleManualTextChange}
              placeholder="Habla o escribe aquí... ej: Comprar entradas de cine para este viernes a las 20:00 urgente"
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-red-500 resize-none font-medium"
            />
          </div>

          {/* Tips / Examples Drawer */}
          {showTips && (
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2 text-xs animate-in fade-in duration-150">
              <span className="font-bold text-red-400 text-[11px] uppercase tracking-wider">
                💡 Prueba diciendo:
              </span>
              <div className="space-y-1.5 text-neutral-300 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleSampleClick("Mañana a las 10 de la mañana reunión con el cliente importante de 45 minutos")}
                  className="w-full text-left p-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-red-500/50 transition-colors"
                >
                  📌 <span className="font-semibold text-white">Tarea con hora:</span> "Mañana a las 10 de la mañana reunión con cliente..."
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick("Nuevo objetivo: Correr media maratón para el 15 de diciembre")}
                  className="w-full text-left p-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-red-500/50 transition-colors"
                >
                  🎯 <span className="font-semibold text-white">Objetivo:</span> "Nuevo objetivo: Correr media maratón para el 15 de diciembre"
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick("Nueva rutina de mañana a las 7:30 con pasos: vaso de agua, estiramientos y ducha")}
                  className="w-full text-left p-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-red-500/50 transition-colors"
                >
                  ⚡ <span className="font-semibold text-white">Rutina con pasos:</span> "Nueva rutina de mañana a las 7:30 con pasos: agua, estiramientos..."
                </button>
              </div>
            </div>
          )}

          {/* Smart Parameter Breakdown (Auto-Filled Fields) */}
          {title && (
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-[11px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <Sparkles size={13} />
                  Parámetros Detectados
                </span>
                <span className="text-[10.5px] font-bold text-neutral-400">
                  Verifica y ajusta si lo deseas
                </span>
              </div>

              {/* Type Switcher */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-black rounded-xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setActiveType('task')}
                  className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeType === 'task' ? 'bg-red-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <CheckSquare size={14} />
                  <span>Tarea</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveType('goal')}
                  className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeType === 'goal' ? 'bg-rose-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Target size={14} />
                  <span>Objetivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveType('routine')}
                  className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeType === 'routine' ? 'bg-red-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Zap size={14} />
                  <span>Rutina</span>
                </button>
              </div>

              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-neutral-400">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-bold focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-2.5">
                {activeType === 'goal' ? (
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10.5px] font-bold text-neutral-400 flex items-center gap-1">
                      <Calendar size={12} className="text-red-500" />
                      Fecha Límite
                    </label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-medium focus:outline-none focus:border-red-500"
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10.5px] font-bold text-neutral-400 flex items-center gap-1">
                        <Calendar size={12} className="text-red-500" />
                        {activeType === 'routine' ? 'Frecuencia' : 'Fecha'}
                      </label>
                      {activeType === 'routine' ? (
                        <div className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs font-bold">
                          Diaria
                        </div>
                      ) : (
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-medium focus:outline-none focus:border-red-500"
                        />
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10.5px] font-bold text-neutral-400 flex items-center gap-1">
                        <Clock size={12} className="text-red-500" />
                        Hora
                      </label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-medium focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Category & Priority Row */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-neutral-400 flex items-center gap-1">
                    <Tag size={12} className="text-red-500" />
                    Categoría
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-medium focus:outline-none focus:border-red-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-neutral-400 flex items-center gap-1">
                    <AlertCircle size={12} className="text-red-500" />
                    Prioridad
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-medium focus:outline-none focus:border-red-500"
                  >
                    <option value="low">Baja</option>
                    <option value="normal">Normal</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>

              {/* Steps / Subtasks Section */}
              {(activeType === 'routine' || steps.length > 0) && (
                <div className="space-y-2 pt-1 border-t border-neutral-800">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] font-bold text-neutral-400">
                      {activeType === 'routine' ? 'Pasos de la rutina' : 'Subtareas'}
                    </label>
                    <span className="text-[10px] text-neutral-500">{steps.length} pasos</span>
                  </div>

                  <div className="space-y-1.5">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs">
                        <span className="text-neutral-200 truncate flex-1">{idx + 1}. {step}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="text-neutral-500 hover:text-red-400 p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}

                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={newStepText}
                        onChange={(e) => setNewStepText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddStep(); } }}
                        placeholder="Añadir paso..."
                        className="flex-1 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-red-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddStep}
                        className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-800 bg-black/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-xs font-bold transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={!title.trim()}
            onClick={handleSave}
            className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs inline-flex items-center justify-center gap-2 transition-all shadow-lg ${
              title.trim()
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:brightness-110 shadow-red-600/30 active:scale-98'
                : 'bg-neutral-900 text-neutral-600 border border-neutral-800 cursor-not-allowed'
            }`}
          >
            <Check size={16} strokeWidth={2.8} />
            <span>
              {activeType === 'task' ? 'Crear Tarea' : activeType === 'goal' ? 'Crear Objetivo' : 'Crear Rutina'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
