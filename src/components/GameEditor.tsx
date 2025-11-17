import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface GameEditorProps {
  onBack: () => void;
  gameId: string | null;
}

const GameEditor = ({ onBack, gameId }: GameEditorProps) => {
  const [selectedTool, setSelectedTool] = useState<string>('object');
  const [objects, setObjects] = useState<any[]>([
    { id: 1, type: 'cube', x: 0, y: 0, z: 0, color: '#9b87f5' },
  ]);
  const [lightIntensity, setLightIntensity] = useState([80]);
  const [gravity, setGravity] = useState([9.8]);

  const tools = [
    { id: 'object', icon: 'Box', label: 'Объекты' },
    { id: 'script', icon: 'Code', label: 'Скрипт' },
    { id: 'physics', icon: 'Zap', label: 'Физика' },
    { id: 'material', icon: 'Palette', label: 'Материалы' },
    { id: 'light', icon: 'Lightbulb', label: 'Свет' },
    { id: 'camera', icon: 'Camera', label: 'Камера' },
  ];

  const primitives = [
    { type: 'cube', icon: '□', label: 'Куб' },
    { type: 'sphere', icon: '○', label: 'Сфера' },
    { type: 'cylinder', icon: '▭', label: 'Цилиндр' },
    { type: 'plane', icon: '▬', label: 'Плоскость' },
  ];

  const addObject = (type: string) => {
    const newObject = {
      id: Date.now(),
      type,
      x: Math.random() * 400 - 200,
      y: Math.random() * 200,
      z: Math.random() * 400 - 200,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    };
    setObjects([...objects, newObject]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <Icon name="ArrowLeft" size={24} />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">
              {gameId ? 'Редактирование игры' : 'Новая игра'}
            </h1>
            <p className="text-xs text-muted-foreground">Автосохранение...</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Icon name="Play" size={16} className="mr-2" />
            Тест
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-primary to-accent neon-glow">
            <Icon name="Share2" size={16} className="mr-2" />
            Опубликовать
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 bg-card border-r border-border overflow-y-auto">
          <Tabs value={selectedTool} onValueChange={setSelectedTool} className="h-full">
            <TabsList className="w-full grid grid-cols-3 rounded-none h-auto p-2 bg-muted/50">
              {tools.slice(0, 6).map((tool) => (
                <TabsTrigger 
                  key={tool.id} 
                  value={tool.id}
                  className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon name={tool.icon as any} size={20} />
                  <span className="text-xs">{tool.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="object" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-semibold mb-3">Примитивы</h3>
                <div className="grid grid-cols-2 gap-2">
                  {primitives.map((prim) => (
                    <Button
                      key={prim.type}
                      variant="outline"
                      className="h-20 flex flex-col gap-2 hover:border-primary hover:bg-primary/10"
                      onClick={() => addObject(prim.type)}
                    >
                      <span className="text-3xl">{prim.icon}</span>
                      <span className="text-xs">{prim.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Объекты на сцене</h3>
                <div className="space-y-2">
                  {objects.map((obj) => (
                    <Card key={obj.id} className="p-3 hover:bg-accent/10 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: obj.color }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">{obj.type}</p>
                          <p className="text-xs text-muted-foreground">ID: {obj.id}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="script" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-semibold mb-3">Скриптинг</h3>
                <Card className="p-4 bg-muted/50 font-mono text-sm">
                  <div className="text-primary">function</div>
                  <div className="ml-4">onPlayerJoin() {'{'}</div>
                  <div className="ml-8 text-muted-foreground">// Ваш код</div>
                  <div className="ml-4">{'}'}</div>
                </Card>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Новый скрипт
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="FileCode" size={16} className="mr-2" />
                  Шаблоны
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="physics" className="p-4 space-y-6 mt-0">
              <div>
                <h3 className="text-sm font-semibold mb-3">Физика</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs mb-2 block">Гравитация: {gravity[0]} м/с²</Label>
                    <Slider 
                      value={gravity} 
                      onValueChange={setGravity}
                      min={0} 
                      max={20} 
                      step={0.1}
                      className="mb-2"
                    />
                  </div>

                  <Card className="p-3 bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Wind" size={16} className="text-primary" />
                      <span className="text-sm font-medium">Ветер</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Включить
                    </Button>
                  </Card>

                  <Card className="p-3 bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Droplet" size={16} className="text-secondary" />
                      <span className="text-sm font-medium">Вода</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Добавить
                    </Button>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="material" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-semibold mb-3">Материалы</h3>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {['#9b87f5', '#0EA5E9', '#D946EF', '#F97316', '#10b981', '#ef4444'].map((color) => (
                    <button
                      key={color}
                      className="aspect-square rounded-lg border-2 border-border hover:border-primary transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="Sparkles" size={16} className="mr-2" />
                    Металл
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="Gem" size={16} className="mr-2" />
                    Стекло
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="Mountain" size={16} className="mr-2" />
                    Камень
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="light" className="p-4 space-y-6 mt-0">
              <div>
                <h3 className="text-sm font-semibold mb-3">Освещение</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs mb-2 block">Интенсивность: {lightIntensity[0]}%</Label>
                    <Slider 
                      value={lightIntensity} 
                      onValueChange={setLightIntensity}
                      min={0} 
                      max={100} 
                      step={1}
                      className="mb-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Sun" size={16} className="mr-2" />
                      Направленный свет
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Lightbulb" size={16} className="mr-2" />
                      Точечный свет
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Flashlight" size={16} className="mr-2" />
                      Прожектор
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="camera" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-semibold mb-3">Камера</h3>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="Camera" size={16} className="mr-2" />
                    От первого лица
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="Users" size={16} className="mr-2" />
                    От третьего лица
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="Maximize" size={16} className="mr-2" />
                    Свободная
                  </Button>
                </div>

                <Card className="p-3 bg-muted/50 mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Управление:</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Поворот</span>
                      <span className="text-primary">ЛКМ + Drag</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Перемещение</span>
                      <span className="text-primary">WASD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Зум</span>
                      <span className="text-primary">Колесико</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </aside>

        <main className="flex-1 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, hsl(220, 27%, 15%) 0%, hsl(220, 27%, 8%) 100%)',
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(155, 135, 245, 0.1) 49px, rgba(155, 135, 245, 0.1) 50px),
                    repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(155, 135, 245, 0.1) 49px, rgba(155, 135, 245, 0.1) 50px)
                  `,
                }}
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                {objects.map((obj) => (
                  <div
                    key={obj.id}
                    className="absolute transition-all duration-300 cursor-move hover:scale-110 neon-glow"
                    style={{
                      left: `calc(50% + ${obj.x}px)`,
                      top: `calc(50% + ${obj.y}px)`,
                      width: '80px',
                      height: '80px',
                      backgroundColor: obj.color,
                      transform: `translateZ(${obj.z}px) rotateX(20deg) rotateY(20deg)`,
                      borderRadius: obj.type === 'sphere' ? '50%' : '8px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3">
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <Icon name="Box" size={14} className="text-primary" />
                <span className="text-muted-foreground">Объектов:</span>
                <span className="font-semibold">{objects.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Zap" size={14} className="text-secondary" />
                <span className="text-muted-foreground">FPS:</span>
                <span className="font-semibold">60</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icon name="Move" size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icon name="RotateCw" size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icon name="Maximize2" size={16} />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icon name="Grid3x3" size={16} />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GameEditor;
