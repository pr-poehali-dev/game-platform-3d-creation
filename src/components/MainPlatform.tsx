import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import GameEditor from '@/components/GameEditor';

const MainPlatform = () => {
  const [activeView, setActiveView] = useState<'home' | 'library' | 'editor'>('home');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    { id: '1', title: 'Космическое приключение', thumbnail: '🚀', plays: 1243 },
    { id: '2', title: 'Гонки на выживание', thumbnail: '🏎️', plays: 856 },
    { id: '3', title: 'Загадки подземелья', thumbnail: '⚔️', plays: 2341 },
  ];

  const openEditor = (gameId?: string) => {
    setSelectedGame(gameId || null);
    setActiveView('editor');
  };

  if (activeView === 'editor') {
    return <GameEditor onBack={() => setActiveView('home')} gameId={selectedGame} />;
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-20 bg-card border-r border-border flex flex-col items-center py-6 gap-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent neon-glow flex items-center justify-center">
          <Icon name="Gamepad2" size={24} className="text-white" />
        </div>

        <nav className="flex-1 flex flex-col gap-4">
          <Button
            variant={activeView === 'home' ? 'default' : 'ghost'}
            size="icon"
            className={activeView === 'home' ? 'neon-glow' : ''}
            onClick={() => setActiveView('home')}
          >
            <Icon name="Home" size={24} />
          </Button>
          
          <Button
            variant={activeView === 'library' ? 'default' : 'ghost'}
            size="icon"
            className={activeView === 'library' ? 'neon-glow' : ''}
            onClick={() => setActiveView('library')}
          >
            <Icon name="Library" size={24} />
          </Button>
        </nav>

        <Button variant="ghost" size="icon">
          <Icon name="Settings" size={24} />
        </Button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {activeView === 'home' && (
          <div className="p-8 animate-fade-in">
            <div className="mb-8">
              <h1 className="text-4xl font-montserrat font-bold mb-2 neon-text">
                Привет, Разработчик! 👋
              </h1>
              <p className="text-muted-foreground text-lg">
                Создавай невероятные 3D игры прямо в браузере
              </p>
            </div>

            <Button
              size="lg"
              className="mb-8 bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 transition-opacity neon-glow"
              onClick={() => openEditor()}
            >
              <Icon name="Plus" className="mr-2" size={20} />
              Создать новую игру
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {games.map((game) => (
                <Card 
                  key={game.id}
                  className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all cursor-pointer group overflow-hidden"
                  onClick={() => openEditor(game.id)}
                >
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform">
                    {game.thumbnail}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {game.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Play" size={16} />
                      <span>{game.plays} игр</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card/30 border-border/30 p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon name="Layers" size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">3D Редактор</h3>
                <p className="text-sm text-muted-foreground">
                  Создавай и размещай объекты в трехмерном пространстве
                </p>
              </Card>

              <Card className="bg-card/30 border-border/30 p-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                  <Icon name="Zap" size={24} className="text-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Физика</h3>
                <p className="text-sm text-muted-foreground">
                  Настраивай гравитацию, столкновения и реалистичные взаимодействия
                </p>
              </Card>

              <Card className="bg-card/30 border-border/30 p-6">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Icon name="Palette" size={24} className="text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Материалы</h3>
                <p className="text-sm text-muted-foreground">
                  Применяй текстуры и визуальные эффекты к объектам
                </p>
              </Card>
            </div>
          </div>
        )}

        {activeView === 'library' && (
          <div className="p-8 animate-fade-in">
            <div className="mb-8">
              <h1 className="text-4xl font-montserrat font-bold mb-2 neon-text">
                Библиотека игр
              </h1>
              <p className="text-muted-foreground text-lg">
                Все твои проекты в одном месте
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {games.map((game) => (
                <Card 
                  key={game.id}
                  className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all cursor-pointer group overflow-hidden"
                  onClick={() => openEditor(game.id)}
                >
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-9xl group-hover:scale-110 transition-transform">
                    {game.thumbnail}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {game.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Play" size={16} />
                      <span>{game.plays}</span>
                    </div>
                  </div>
                </Card>
              ))}
              
              <Card 
                className="bg-card/30 backdrop-blur-sm border-border/50 border-dashed hover:border-primary/50 transition-all cursor-pointer group overflow-hidden flex items-center justify-center aspect-square"
                onClick={() => openEditor()}
              >
                <div className="text-center p-6">
                  <Icon name="Plus" size={48} className="mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="text-muted-foreground group-hover:text-primary transition-colors font-medium">
                    Новый проект
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainPlatform;
