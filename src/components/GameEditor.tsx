import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

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
  const [selectedObject, setSelectedObject] = useState<number | null>(null);
  const [objects, setObjects] = useState<GameObject[]>([
    { id: 1, name: 'Baseplate', type: 'Part', x: 0, y: -2, z: 0, color: '#4a5568', size: { x: 512, y: 1, z: 512 } },
    { id: 2, name: 'SpawnLocation', type: 'SpawnLocation', x: 0, y: 0.5, z: 0, color: '#3b82f6', size: { x: 6, y: 1, z: 6 } },
  ]);
  const [activeTool, setActiveTool] = useState<'select' | 'move' | 'scale' | 'rotate'>('select');

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
    setObjects([...objects, newPart]);
    setSelectedObject(newPart.id);
  };

  const deleteObject = (id: number) => {
    setObjects(objects.filter(obj => obj.id !== id));
    if (selectedObject === id) setSelectedObject(null);
  };

  const duplicateObject = (id: number) => {
    const obj = objects.find(o => o.id === id);
    if (obj) {
      const newObj = { ...obj, id: Date.now(), name: `${obj.name} (Copy)`, x: obj.x + 2, z: obj.z + 2 };
      setObjects([...objects, newObj]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#2d2d30]">
      <header className="h-12 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center px-4 gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-[#3e3e42]">
          <Icon name="ArrowLeft" size={18} />
        </Button>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-white hover:bg-[#007acc]">
            <Icon name="Save" size={18} />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-[#007acc]">
            <Icon name="Undo" size={18} />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-[#007acc]">
            <Icon name="Redo" size={18} />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-[#3e3e42]" />

        <div className="flex items-center gap-1">
          <Button 
            variant={activeTool === 'select' ? 'secondary' : 'ghost'} 
            size="sm" 
            className={activeTool === 'select' ? 'bg-[#007acc] text-white' : 'text-white hover:bg-[#3e3e42]'}
            onClick={() => setActiveTool('select')}
          >
            <Icon name="MousePointer" size={18} />
          </Button>
          <Button 
            variant={activeTool === 'move' ? 'secondary' : 'ghost'} 
            size="sm"
            className={activeTool === 'move' ? 'bg-[#007acc] text-white' : 'text-white hover:bg-[#3e3e42]'}
            onClick={() => setActiveTool('move')}
          >
            <Icon name="Move" size={18} />
          </Button>
          <Button 
            variant={activeTool === 'scale' ? 'secondary' : 'ghost'} 
            size="sm"
            className={activeTool === 'scale' ? 'bg-[#007acc] text-white' : 'text-white hover:bg-[#3e3e42]'}
            onClick={() => setActiveTool('scale')}
          >
            <Icon name="Maximize2" size={18} />
          </Button>
          <Button 
            variant={activeTool === 'rotate' ? 'secondary' : 'ghost'} 
            size="sm"
            className={activeTool === 'rotate' ? 'bg-[#007acc] text-white' : 'text-white hover:bg-[#3e3e42]'}
            onClick={() => setActiveTool('rotate')}
          >
            <Icon name="RotateCw" size={18} />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 bg-[#3e3e42]" />

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-[#16825d] text-white hover:bg-[#1a9e6f]"
          >
            <Icon name="Play" size={18} className="mr-1" />
            Play
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
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-[#3e3e42]">
                <Icon name="Plus" size={14} />
              </Button>
            </div>
            <Input 
              placeholder="Filter workspace" 
              className="h-7 bg-[#3c3c3c] border-[#3e3e42] text-white text-xs"
            />
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-white text-sm py-1 px-2 hover:bg-[#2a2d2e] rounded cursor-pointer">
                  <Icon name="ChevronDown" size={14} />
                  <Icon name="Folder" size={14} className="text-blue-400" />
                  <span className="text-xs">Workspace</span>
                </div>

                <div className="ml-4 space-y-1">
                  {objects.map((obj) => (
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

                <div className="flex items-center gap-1 text-white text-sm py-1 px-2 hover:bg-[#2a2d2e] rounded cursor-pointer">
                  <Icon name="ChevronRight" size={14} />
                  <Icon name="Users" size={14} className="text-green-400" />
                  <span className="text-xs">Players</span>
                </div>

                <div className="flex items-center gap-1 text-white text-sm py-1 px-2 hover:bg-[#2a2d2e] rounded cursor-pointer">
                  <Icon name="ChevronRight" size={14} />
                  <Icon name="Lightbulb" size={14} className="text-yellow-400" />
                  <span className="text-xs">Lighting</span>
                </div>

                <div className="flex items-center gap-1 text-white text-sm py-1 px-2 hover:bg-[#2a2d2e] rounded cursor-pointer">
                  <Icon name="ChevronRight" size={14} />
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
              background: 'linear-gradient(to bottom, #87ceeb 0%, #e0f6ff 50%, #90ee90 100%)',
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
                    selectedObject === obj.id ? 'ring-2 ring-blue-400' : ''
                  }`}
                  style={{
                    left: `calc(50% + ${obj.x * 10}px)`,
                    top: `calc(50% + ${obj.y * 5}px)`,
                    width: `${obj.size.x * 10}px`,
                    height: `${obj.size.y * 10}px`,
                    backgroundColor: obj.color,
                    transform: `translateZ(${obj.z * 10}px) rotateX(-20deg)`,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                  }}
                  onClick={() => setSelectedObject(obj.id)}
                />
              ))}
            </div>
          </div>

          <div className="absolute top-4 left-4 bg-[#252526]/90 backdrop-blur-sm border border-[#3e3e42] rounded p-2 text-white text-xs space-y-1">
            <div>Camera: Free</div>
            <div>Position: 0, 20, 30</div>
          </div>
        </main>

        <aside className="w-64 bg-[#252526] border-l border-[#3e3e42] flex flex-col">
          <div className="p-2 border-b border-[#3e3e42] flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Properties</span>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-3">
              {selectedObject ? (
                <>
                  {objects.find(o => o.id === selectedObject) && (
                    <>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Name</label>
                        <Input 
                          value={objects.find(o => o.id === selectedObject)?.name}
                          onChange={(e) => {
                            setObjects(objects.map(o => 
                              o.id === selectedObject ? { ...o, name: e.target.value } : o
                            ));
                          }}
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
                              value={objects.find(o => o.id === selectedObject)?.x.toFixed(2)}
                              className="h-7 bg-[#3c3c3c] border-[#3e3e42] text-white text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-4">Y</span>
                            <Input 
                              type="number"
                              value={objects.find(o => o.id === selectedObject)?.y.toFixed(2)}
                              className="h-7 bg-[#3c3c3c] border-[#3e3e42] text-white text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-4">Z</span>
                            <Input 
                              type="number"
                              value={objects.find(o => o.id === selectedObject)?.z.toFixed(2)}
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
                              value={objects.find(o => o.id === selectedObject)?.size.x}
                              className="h-7 bg-[#3c3c3c] border-[#3e3e42] text-white text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-4">Y</span>
                            <Input 
                              type="number"
                              value={objects.find(o => o.id === selectedObject)?.size.y}
                              className="h-7 bg-[#3c3c3c] border-[#3e3e42] text-white text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-4">Z</span>
                            <Input 
                              type="number"
                              value={objects.find(o => o.id === selectedObject)?.size.z}
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
                          onChange={(e) => {
                            setObjects(objects.map(o => 
                              o.id === selectedObject ? { ...o, color: e.target.value } : o
                            ));
                          }}
                          className="w-full h-8 bg-[#3c3c3c] border border-[#3e3e42] rounded cursor-pointer"
                        />
                      </div>
                    </>
                  )}
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
        </div>
      </footer>
    </div>
  );
};

export default GameEditor;
