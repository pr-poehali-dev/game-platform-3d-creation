import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Game3DEngine from './Game3DEngine';

interface GameEditorProps {
  onBack: () => void;
  gameId: string | null;
}

interface GameObject {
  id: number;
  name: string;
  type: 'Part' | 'SpawnLocation' | 'Model' | 'Script';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
}

const GameEditor = ({ onBack, gameId }: GameEditorProps) => {
  const { toast } = useToast();
  const [selectedObject, setSelectedObject] = useState<number | null>(null);
  const [objects, setObjects] = useState<GameObject[]>([
    { 
      id: 1, 
      name: 'Baseplate', 
      type: 'Part', 
      position: [0, -0.5, 0], 
      rotation: [0, 0, 0],
      scale: [50, 0.5, 50],
      color: '#4a5568'
    },
    { 
      id: 2, 
      name: 'SpawnLocation', 
      type: 'SpawnLocation', 
      position: [0, 0.5, 0], 
      rotation: [0, 0, 0],
      scale: [3, 0.5, 3],
      color: '#3b82f6'
    },
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
      position: [Math.random() * 10 - 5, 2 + Math.random() * 5, Math.random() * 10 - 5],
      rotation: [0, 0, 0],
      scale: [2, 2, 2],
      color: type === 'SpawnLocation' ? '#3b82f6' : `hsl(${Math.random() * 360}, 70%, 50%)`,
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
      const newObj: GameObject = { 
        ...obj, 
        id: Date.now(), 
        name: `${obj.name} (Copy)`,
        position: [obj.position[0] + 2, obj.position[1], obj.position[2] + 2]
      };
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

  const updateObjectPosition = (id: number, axis: number, value: number) => {
    const newObjects = objects.map(o => {
      if (o.id === id) {
        const newPosition: [number, number, number] = [...o.position];
        newPosition[axis] = value;
        return { ...o, position: newPosition };
      }
      return o;
    });
    setObjects(newObjects);
  };

  const updateObjectScale = (id: number, axis: number, value: number) => {
    const newObjects = objects.map(o => {
      if (o.id === id) {
        const newScale: [number, number, number] = [...o.scale];
        newScale[axis] = Math.max(0.1, value);
        return { ...o, scale: newScale };
      }
      return o;
    });
    setObjects(newObjects);
  };

  const toggleFolder = (folder: string) => {
    setExpandedFolders({ ...expandedFolders, [folder]: !expandedFolders[folder] });
  };

  const playGame = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast({ 
        title: "🎮 Игра запущена", 
        description: "WASD - движение, Пробел - прыжок" 
      });
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
          <Game3DEngine 
            objects={objects}
            selectedObject={selectedObject}
            onSelectObject={setSelectedObject}
            isPlaying={isPlaying}
            activeTool={activeTool}
          />

          {isPlaying && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-6 py-2 rounded-lg">
              <div className="text-center">
                <p className="font-semibold">🎮 Режим игры</p>
                <p className="text-xs mt-1">WASD - движение | Пробел - прыжок</p>
              </div>
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
                      {['X', 'Y', 'Z'].map((axis, idx) => (
                        <div key={axis} className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-4">{axis}</span>
                          <Input 
                            type="number"
                            step="0.5"
                            value={objects.find(o => o.id === selectedObject)?.position[idx].toFixed(2)}
                            onChange={(e) => updateObjectPosition(selectedObject, idx, parseFloat(e.target.value))}
                            className="h-7 bg-[#3c3c3c] border-[#3e3e42] text-white text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-[#3e3e42]" />

                  <div>
                    <div className="text-xs text-gray-400 mb-2">Scale</div>
                    <div className="space-y-2">
                      {['X', 'Y', 'Z'].map((axis, idx) => (
                        <div key={axis} className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-4">{axis}</span>
                          <Input 
                            type="number"
                            step="0.5"
                            value={objects.find(o => o.id === selectedObject)?.scale[idx]}
                            onChange={(e) => updateObjectScale(selectedObject, idx, parseFloat(e.target.value))}
                            className="h-7 bg-[#3c3c3c] border-[#3e3e42] text-white text-xs"
                          />
                        </div>
                      ))}
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
          {isPlaying && (
            <>
              <span>•</span>
              <span className="text-yellow-300">▶ Playing</span>
            </>
          )}
        </div>
      </footer>
    </div>
  );
};

export default GameEditor;
