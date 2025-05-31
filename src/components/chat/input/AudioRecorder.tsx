
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mic, Square, Play, Pause, Send } from 'lucide-react';
import { FileData } from '@/types/messageTypes';

interface AudioRecorderProps {
  isDarkMode: boolean;
  onAudioReady: (audioData: FileData) => void;
  onCancel: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  isDarkMode,
  onAudioReady,
  onCancel
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start duration counter
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const sendAudio = async () => {
    if (!audioBlob) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const fileName = `audio_${Date.now()}.webm`;
      
      onAudioReady({
        base64,
        fileName,
        mimeType: 'audio/webm',
        size: audioBlob.size
      });
    };
    reader.readAsDataURL(audioBlob);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn(
      "flex items-center gap-2 p-3 rounded-lg border",
      isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-gray-50 border-gray-200"
    )}>
      {!audioBlob ? (
        <>
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={isRecording ? stopRecording : startRecording}
            className="flex items-center gap-2"
          >
            {isRecording ? <Square size={16} /> : <Mic size={16} />}
            {isRecording ? 'Parar' : 'Gravar'}
          </Button>
          
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className={cn(
                "text-sm font-mono",
                isDarkMode ? "text-zinc-300" : "text-gray-600"
              )}>
                {formatTime(duration)}
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={isPlaying ? pauseAudio : playAudio}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          
          <span className={cn(
            "text-sm",
            isDarkMode ? "text-zinc-300" : "text-gray-600"
          )}>
            Áudio gravado ({formatTime(duration)})
          </span>
          
          <div className="flex gap-1 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-red-600 hover:bg-red-100"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={sendAudio}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Send size={16} className="mr-1" />
              Enviar
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
