import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AuthScreenProps {
  onAuth: () => void;
}

const AuthScreen = ({ onAuth }: AuthScreenProps) => {
  const [code, setCode] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code === '0228') {
      toast({
        title: "Доступ разрешен! 🚀",
        description: "Добро пожаловать в игровую платформу",
      });
      onAuth();
    } else {
      toast({
        title: "Ошибка доступа",
        description: "Неверный код. Попробуйте еще раз.",
        variant: "destructive",
      });
      setCode('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted to-background opacity-50" />
      
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent neon-glow-strong">
            <Icon name="Gamepad2" size={48} className="text-white" />
          </div>
          
          <h1 className="text-5xl font-montserrat font-bold mb-3 neon-text bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            GAME STUDIO
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Создавай 3D игры как в Roblox Studio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-8 neon-glow">
            <label htmlFor="code" className="block text-sm font-medium text-foreground mb-3">
              Введите код доступа
            </label>
            
            <Input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="****"
              className="text-center text-2xl tracking-widest font-bold bg-muted/50 border-primary/50 focus:border-primary neon-glow transition-all"
              maxLength={4}
              autoComplete="off"
            />
            
            <Button 
              type="submit" 
              className="w-full mt-6 bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 transition-opacity text-lg font-semibold neon-glow"
              size="lg"
            >
              <Icon name="Unlock" className="mr-2" size={20} />
              Войти
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>Код: 0228</span>
          </div>
        </form>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-lg p-4">
            <Icon name="Box" size={24} className="mx-auto mb-2 text-primary" />
            <p className="text-xs text-muted-foreground">3D Объекты</p>
          </div>
          <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-lg p-4">
            <Icon name="Lightbulb" size={24} className="mx-auto mb-2 text-secondary" />
            <p className="text-xs text-muted-foreground">Освещение</p>
          </div>
          <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-lg p-4">
            <Icon name="Code" size={24} className="mx-auto mb-2 text-accent" />
            <p className="text-xs text-muted-foreground">Скриптинг</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
