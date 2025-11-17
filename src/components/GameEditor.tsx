import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface GameEditorProps {
  onBack: () => void;
  gameId: string | null;
}

interface GameObject {
  id: number;
  name: string;
  type: 'Part' | 'SpawnLocation' | 'Model' | 'Script';
  x: number;
  y: number;
  z: number;
  color: string;
  size: { x: number; y: number; z: number };
}

const GameEditor = ({ onBack, gameId }: GameEditorProps) => {
  const { toast } = useToast();
  const [selectedObject, setSelectedObject] = useState<number | null>(null);
  const [objects, setObjects] = useState<GameObject[]>([
    { id: 1, name: 'Baseplate', type: 'Part', x: 0, y: -2, z: 0, color: '#4a5568', size: { x: 512, y: 1, z: 512 } },
    { id: 2, name: 'SpawnLocation', type: 'SpawnLocation', x: 0, y: 0.5, z: 0, color: '#3b82f6', size: { x: 6, y: 1, z: 6 } },
  ]);
  const [activeTool, setActiveTool] = useState<'select' | 'move' | 'scale' | 'rotate'>('select');
  const [history, setHistory] = useState<GameObject[][]>([objects]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [filterText, setFilterText] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({
    workspace: true,
    players: false,
    lighting: false,
    storage: false,
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const saveToHistory = (newObjects: GameObject[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newObjects);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setObjects(newObjects);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setObjects(history[historyIndex - 1]);
      toast({ title: "Отменено", duration: 1000 });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setObjects(history[historyIndex + 1]);
      toast({ title: "Повторено", duration: 1000 });
    }
  };

  const saveProject = () => {
    localStorage.setItem(`game_${gameId || 'new'}`, JSON.stringify(objects));
    toast({ title: "Сохранено", description: "Проект успешно сохранен" });
  };

  const addPart = (type: 'Part' | 'SpawnLocation' | 'Model') => {
    const newPart: GameObject = {
      id: Date.now(),
      name: type === 'Part' ? 'Part' : type === 'SpawnLocation' ? 'SpawnLocation' : 'Model',
      type,
      x: Math.random() * 20 - 10,
      y: Math.random() * 10 + 5,
      z: Math.random() * 20 - 10,
      color: type === 'SpawnLocation' ? '#3b82f6' : `hsl(${Math.random() * 360}, 70%, 50%)`,
      size: { x: 4, y: 4, z: 4 },
    };
    const newObjects = [...objects, newPart];
    saveToHistory(newObjects);
    setSelectedObject(newPart.id);
    toast({ title: "Объект создан", description: `${type} добавлен в Workspace` });
  };

  const deleteObject = (id: number) => {
    const objToDelete = objects.find(o => o.id === id);
    if (objToDelete && (objToDelete.name === 'Baseplate' || objToDelete.name === 'SpawnLocation')) {
      toast({ title: "Ошибка", description: "Нельзя удалить базовые объекты", variant: "destructive" });
      return;
    }
    const newObjects = objects.filter(obj => obj.id !== id);
    saveToHistory(newObjects);
    if (selectedObject === id) setSelectedObject(null);
    toast({ title: "Удалено", description: "Объект удален из Workspace" });
  };

  const duplicateObject = (id: number) => {
    const obj = objects.find(o => o.id === id);
    if (obj) {
      const newObj = { ...obj, id: Date.now(), name: `${obj.name} (Copy)`, x: obj.x + 2, z: obj.z + 2 };
      const newObjects = [...objects, newObj];
      saveToHistory(newObjects);
      setSelectedObject(newObj.id);
      toast({ title: "Дублировано", description: "Создана копия объекта" });
    }
  };

  const updateObjectProperty = (id: number, property: keyof GameObject, value: any) => {
    const newObjects = objects.map(o => o.id === id ? { ...o, [property]: value } : o);
    setObjects(newObjects);
  };

  const updateObjectSize = (id: number, axis: 'x' | 'y' | 'z', value: number) => {
    const newObjects = objects.map(o => 
      o.id === id ? { ...o, size: { ...o.size, [axis]: Math.max(0.1, value) } } : o
    );
    setObjects(newObjects);
  };

  const updateObjectPosition = (id: number, axis: 'x' | 'y' | 'z', value: number) => {
    const newObjects = objects.map(o => 
      o.id === id ? { ...o, [axis]: value } : o
    );
    setObjects(newObjects);
  };

  const toggleFolder = (folder: string) => {
    setExpandedFolders({ ...expandedFolders, [folder]: !expandedFolders[folder] });
  };

  const playGame = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast({ title: "Игра запущена", description: "Режим тестирования активен" });
    } else {
      toast({ title: "Игра остановлена", description: "Вернулись в режим редактирования" });
    }
  };

  const filteredObjects = objects.filter(obj => 
    obj.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-[#2d2d30]">
      <header className="h-12 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center px-4 gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-[#3e3e42]">
          <Icon name="ArrowLeft" size={18} />
        </Button>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-[#007acc]"
            onClick={saveProject}
          >
            <Icon name="Save" size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-[#007acc]"
            onClick={undo}
            disabled={historyIndex === 0}
          >
            <Icon name="Undo" size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-[#007acc]"
            onClick={redo}
            disabled={historyIndex === history.length - 1}
          >
            <Icon name="Redo" size={18} />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-[#3e3e42]" />

        <div className="flex items-center gap-1">
          <Button 
            variant={activeTool === 'select' ? 'secondary' : 'ghost'} 
            size="sm" 
            className={activeTool === 'select' ? 'bg-[#007acc] text-white' : 'text-white hover:bg-[#3e3e42]'}
            onClick={() => {
              setActiveTool('select');
              toast({ title: "Инструмент: Выделение", duration: 1000 });
            }}
          >
            <Icon name="MousePointer" size={18} />
          </Button>
          <Button 
            variant={activeTool === 'move' ? 'secondary' : 'ghost'} 
            size="sm"
            className={activeTool === 'move' ? 'bg-[#007acc] text-white' : 'text-white hover:bg-[#3e3e42]'}
            onClick={() => {
              setActiveTool('move');
              toast({ title: "Инструмент: Перемещение", duration: 1000 });
            }}
          >
            <Icon name="Move" size={18} />
          </Button>
          <Button 
            variant={activeTool === 'scale' ? 'secondary' : 'ghost'} 
            size="sm"
            className={activeTool === 'scale' ? 'bg-[#007acc] text-white' : 'text-white hover:bg-[#3e3e42]'}
            onClick={() => {
              setActiveTool('scale');
              toast({ title: "Инструмент: Масштаб", duration: 1000 });
            }}
          >
            <Icon name="Maximize2" size={18} />
          </Button>
          <Button 
            variant={activeTool === 'rotate' ? 'secondary' : 'ghost'} 
            size="sm"
            className={activeTool === 'rotate' ? 'bg-[#007acc] text-white' : 'text-white hover:bg-[#3e3e42]'}
            onClick={() => {
              setActiveTool('rotate');
              toast({ title: "Инструмент: Поворот", duration: 1000 });
            }}
          >
            <Icon name="RotateCw" size={18} />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-[#3e3e42]" />

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={isPlaying ? "bg-[#c42b1c] text-white hover:bg-[#e81123]" : "bg-[#16825d] text-white hover:bg-[#1a9e6f]"}
            onClick={playGame}
          >
            <Icon name={isPlaying ? "Square" : "Play"} size={18} className="mr-1" />
            {isPlaying ? "Stop" : "Play"}
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-400">File | {gameId || 'New Place'}</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col">
          <div className="p-2 border-b border-[#3e3e42]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white">Explorer</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-white hover:bg-[#3e3e42]"
                onClick={() => addPart('Part')}
              >
                <Icon name="Plus" size={14} />
              </Button>
            </div>
            <Input 
              placeholder="Filter workspace" 
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="h-7 bg-[#3c3c3c] border-[#3e3e42] text-white text-xs placeholder:text-gray-500"
            />
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              <div className="space-y-1">
                <div 
                  className="flex items-center gap-1 text-white text-sm py-1 px-2 hover:bg-[#2a2d2e] rounded cursor-pointer"
                  onClick={() => toggleFolder('workspace')}
                >
                  <Icon name={expandedFolders.workspace ? "ChevronDown" : "ChevronRight"} size={14} />
                  <Icon name="Folder" size={14} className="text-blue-400" />
                  <span className="text-xs">Workspace</span>
                </div>

                {expandedFolders.workspace && (
                  <div className="ml-4 space-y-1">
                    {filteredObjects.map((obj) => (
                      <div 
                        key={obj.id}
                        className={`flex items-center justify-between gap-1 text-white text-sm py-1 px-2 rounded cursor-pointer ${
                          selectedObject === obj.id ? 'bg-[#094771]' : 'hover:bg-[#2a2d2e]'
                        }`}
                        onClick={() => setSelectedObject(obj.id)}
                      >
                        <div className="flex items-center gap-1 flex-1">
                          <Icon name="Box" size={14} className={obj.type === 'SpawnLocation' ? 'text-blue-400' : 'text-gray-400'} />
                          <span className="text-xs truncate">{obj.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div 
                  className="flex items-center gap-1 text-white text-sm py-1 px-2 hover:bg-[#2a2d2e] rounded cursor-pointer"
                  onClick={() => toggleFolder('players')}
                >
                  <Icon name={expandedFolders.players ? "ChevronDown" : "ChevronRight"} size={14} />
                  <Icon name="Users" size={14} className="text-green-400" />
                  <span className="text-xs">Players</span>
                </div>

                <div 
                  className="flex items-center gap-1 text-white text-sm py-1 px-2 hover:bg-[#2a2d2e] rounded cursor-pointer"
                  onClick={() => toggleFolder('lighting')}
                >
                  <Icon name={expandedFolders.lighting ? "ChevronDown" : "ChevronRight"} size={14} />
                  <Icon name="Lightbulb" size={14} className="text-yellow-400" />
                  <span className="text-xs">Lighting</span>
                </div>

                <div 
                  className="flex items-center gap-1 text-white text-sm py-1 px-2 hover:bg-[#2a2d2e] rounded cursor-pointer"
                  onClick={() => toggleFolder('storage')}
                >
                  <Icon name={expandedFolders.storage ? "ChevronDown" : "ChevronRight"} size={14} />
                  <Icon name="Settings" size={14} className="text-gray-400" />
                  <span className="text-xs">ReplicatedStorage</span>
                </div>
              </div>
            </div>
          </ScrollArea>
        </aside>

        <main className="flex-1 bg-[#1e1e1e] relative">
          <div 
            className="absolute inset-0"
            style={{
              background: isPlaying 
                ? 'linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
                : 'linear-gradient(to bottom, #87ceeb 0%, #e0f6ff 50%, #90ee90 100%)',
            }}
          >
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(0, 0, 0, 0.05) 49px, rgba(0, 0, 0, 0.05) 50px),
                  repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(0, 0, 0, 0.05) 49px, rgba(0, 0, 0, 0.05) 50px)
                `,
                transform: 'perspective(500px) rotateX(60deg)',
                transformOrigin: 'center bottom',
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px' }}>
              {objects.map((obj) => (
                <div
                  key={obj.id}
                  className={`absolute transition-all cursor-pointer ${
                    selectedObject === obj.id ? 'ring-4 ring-blue-400' : ''
                  } ${activeTool === 'move' ? 'hover:ring-2 hover:ring-yellow-400' : ''}`}
                  style={{
                    left: `calc(50% + ${obj.x * 10}px)`,
                    top: `calc(50% + ${obj.y * 5}px)`,
                    width: `${obj.size.x * 10}px`,
                    height: `${obj.size.y * 10}px`,
                    backgroundColor: obj.color,
                    transform: `translateZ(${obj.z * 10}px) rotateX(-20deg)`,
                    boxShadow: selectedObject === obj.id 
                      ? '0 0 40px rgba(59, 130, 246, 0.8), 0 10px 30px rgba(0, 0, 0, 0.3)'
                      : '0 10px 30px rgba(0, 0, 0, 0.3)',
                  }}
                  onClick={() => setSelectedObject(obj.id)}
                />
              ))}
            </div>
          </div>

          <div className="absolute top-4 left-4 bg-[#252526]/90 backdrop-blur-sm border border-[#3e3e42] rounded p-2 text-white text-xs space-y-1">
            <div className="flex items-center gap-2">
              <Icon name="Camera" size={12} className="text-blue-400" />
              <span>Camera: Free</span>
            </div>
            <div>Position: 0, 20, 30</div>
            <div className="flex items-center gap-2">
              <Icon name="Zap" size={12} className="text-yellow-400" />
              <span>FPS: 60</span>
            </div>
          </div>

          {isPlaying && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-lg">
              <span className="text-lg font-semibold">▶ Режим тестирования</span>
            </div>
          )}
        </main>

        <aside className="w-64 bg-[#252526] border-l border-[#3e3e42] flex flex-col">
          <div className="p-2 border-b border-[#3e3e42] flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Properties</span>
            {selectedObject && (
              <span className="text-xs text-gray-400">{objects.find(o => o.id === selectedObject)?.type}</span>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {selectedObject && objects.find(o => o.id === selectedObject) ? (
                <>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Name</label>
                    <Input 
                      value={objects.find(o => o.id === selectedObject)?.name}
                      onChange={(e) => updateObjectProperty(selectedObject, 'name', e.target.value)}
                      className="h-7 bg-[#3c3c3c] border-[#3e3e42] text-white text-xs"
                    />
                  </div>

                  <Separator className="bg-[#3e3e42]" />

                  <div>
                    <div className="text-xs text-gray-400 mb-2">Position</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-4">X</span>
                        <Input 
                          type="number"
                          step="0.1"
                          value={objects.find(o => o.id === selectedObject)?.x.toFixed(2)}
                          onChange={(e) => updateObjectPosition(selectedObject, 'x', parseFloat(e.target.value))}
                          className="h-7 bg-[#3c3c3c] border-[#3e3e42] text-white text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-4">Y</span>
                        <Input 
                          type="number"
                          step="0.1"
                          value={objects.find(o => o.id === selectedObject)?.y.toFixed(2)}
                          onChange={(e) => updateObjectPosition(selectedObject, 'y', parseFloat(e.target.value))}
                          className="h-7 bg-[#3c3c3c] border-[#3e3e42] text-white text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-4">Z</span>
                        <Input 
                          type="number"
                          step="0.1"
                          value={objects.find(o => o.id === selectedObject)?.z.toFixed(2)}
                          onChange={(e) => updateObjectPosition(selectedObject, 'z', parseFloat(e.target.value))}
                          className="h-7 bg-[#3c3c3c] border-[#3e3e42] text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#3e3e42]" />

                  <div>
                    <div className="text-xs text-gray-400 mb-2">Size</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-4">X</span>
                        <Input 
                          type="number"
                          step="0.1"
                          value={objects.find(o => o.id === selectedObject)?.size.x}
                          onChange={(e) => updateObjectSize(selectedObject, 'x', parseFloat(e.target.value))}
                          className="h-7 bg-[#3c3c3c] border-[#3e3e42] text-white text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-4">Y</span>
                        <Input 
                          type="number"
                          step="0.1"
                          value={objects.find(o => o.id === selectedObject)?.size.y}
                          onChange={(e) => updateObjectSize(selectedObject, 'y', parseFloat(e.target.value))}
                          className="h-7 bg-[#3c3c3c] border-[#3e3e42] text-white text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-4">Z</span>
                        <Input 
                          type="number"
                          step="0.1"
                          value={objects.find(o => o.id === selectedObject)?.size.z}
                          onChange={(e) => updateObjectSize(selectedObject, 'z', parseFloat(e.target.value))}
                          className="h-7 bg-[#3c3c3c] border-[#3e3e42] text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#3e3e42]" />

                  <div>
                    <div className="text-xs text-gray-400 mb-2">Color</div>
                    <input 
                      type="color"
                      value={objects.find(o => o.id === selectedObject)?.color}
                      onChange={(e) => updateObjectProperty(selectedObject, 'color', e.target.value)}
                      className="w-full h-8 bg-[#3c3c3c] border border-[#3e3e42] rounded cursor-pointer"
                    />
                  </div>
                </>
              ) : (
                <div className="text-xs text-gray-400 text-center py-8">
                  No object selected
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-2 border-t border-[#3e3e42] space-y-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-white hover:bg-[#3e3e42] text-xs"
              onClick={() => addPart('Part')}
            >
              <Icon name="Plus" size={14} className="mr-2" />
              Insert Part
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-white hover:bg-[#3e3e42] text-xs"
              onClick={() => addPart('SpawnLocation')}
            >
              <Icon name="MapPin" size={14} className="mr-2" />
              Spawn Location
            </Button>
            {selectedObject && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-white hover:bg-[#3e3e42] text-xs"
                  onClick={() => duplicateObject(selectedObject)}
                >
                  <Icon name="Copy" size={14} className="mr-2" />
                  Duplicate
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-red-400 hover:bg-[#3e3e42] text-xs"
                  onClick={() => deleteObject(selectedObject)}
                >
                  <Icon name="Trash2" size={14} className="mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </aside>
      </div>

      <footer className="h-6 bg-[#007acc] flex items-center px-4">
        <div className="flex items-center gap-4 text-xs text-white">
          <span>Studio {new Date().getFullYear()}</span>
          <span>•</span>
          <span>{objects.length} Parts</span>
          <span>•</span>
          <span>Tool: {activeTool}</span>
        </div>
      </footer>
    </div>
  );
};

export default GameEditor;
