import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Role = 'user' | 'junior-admin' | 'admin' | 'senior-admin' | 'creator';

interface User {
  id: string;
  nickname: string;
  role: Role;
}

interface Message {
  id: string;
  user: User;
  text: string;
  timestamp: Date;
}

const Index = () => {
  const [currentUser] = useState<User>({
    id: '1',
    nickname: 'Создатель',
    role: 'creator'
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: { id: '2', nickname: 'Пользователь1', role: 'user' },
      text: 'Привет всем!',
      timestamp: new Date()
    },
    {
      id: '2',
      user: { id: '3', nickname: 'МладшийАдмин', role: 'junior-admin' },
      text: 'Добро пожаловать на VELSGOT!',
      timestamp: new Date()
    },
    {
      id: '3',
      user: { id: '4', nickname: 'Админ', role: 'admin' },
      text: 'Отличный стрим сегодня',
      timestamp: new Date()
    }
  ]);

  const [messageInput, setMessageInput] = useState('');
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const getRoleClass = (role: Role): string => {
    const roleClasses: Record<Role, string> = {
      'user': 'role-user',
      'junior-admin': 'role-junior-admin',
      'admin': 'role-admin',
      'senior-admin': 'role-senior-admin',
      'creator': 'role-creator'
    };
    return roleClasses[role];
  };

  const getRoleBadge = (role: Role): string => {
    const roleBadges: Record<Role, string> = {
      'user': 'Пользователь',
      'junior-admin': 'Младший Админ',
      'admin': 'Админ',
      'senior-admin': 'Старший Админ',
      'creator': 'Создатель'
    };
    return roleBadges[role];
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        user: currentUser,
        text: messageInput,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-primary/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold gradient-shimmer bg-clip-text text-transparent">
            VELSGOT
          </h1>
          
          <div className="flex items-center gap-4">
            <Dialog open={isAdminPanelOpen} onOpenChange={setIsAdminPanelOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="neon-border border-primary text-primary hover:bg-primary/20">
                  <Icon name="Settings" size={20} className="mr-2" />
                  Админ панель
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-primary/30 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-orbitron text-primary">Панель управления</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="users" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="users">Пользователи</TabsTrigger>
                    <TabsTrigger value="video">Видео</TabsTrigger>
                    <TabsTrigger value="voting">Голосование</TabsTrigger>
                  </TabsList>
                  <TabsContent value="users" className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Поиск по нику</h3>
                      <Input placeholder="Введите никнейм..." className="bg-background border-primary/30" />
                    </div>
                    <ScrollArea className="h-[300px] rounded-md border border-primary/30 p-4">
                      <div className="space-y-2">
                        {[
                          { nickname: 'Пользователь1', role: 'user' as Role },
                          { nickname: 'МладшийАдмин', role: 'junior-admin' as Role },
                          { nickname: 'Админ', role: 'admin' as Role }
                        ].map((user, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/30 hover:bg-muted/50">
                            <div className="flex items-center gap-2">
                              <span className={getRoleClass(user.role)}>{user.nickname}</span>
                              <Badge variant="outline" className="text-xs">{getRoleBadge(user.role)}</Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" className="h-8">
                                <Icon name="Ban" size={16} />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8">
                                <Icon name="MessageSquareOff" size={16} />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8">
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="video" className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Загрузить видео из ВК</h3>
                      <Input placeholder="Ссылка на видео ВК..." className="bg-background border-primary/30" />
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/80">
                        Загрузить видео
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="voting" className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Создать голосование</h3>
                      <Input placeholder="Название видео 1" className="bg-background border-primary/30" />
                      <Input placeholder="Название видео 2" className="bg-background border-primary/30" />
                      <Input placeholder="Название видео 3" className="bg-background border-primary/30" />
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/80">
                        Создать голосование
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border-2 border-primary">
                    <AvatarFallback className={`${getRoleClass(currentUser.role)} bg-muted`}>
                      {currentUser.nickname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className={getRoleClass(currentUser.role)}>{currentUser.nickname}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-primary/30">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-orbitron text-primary">Профиль</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-4 border-primary">
                      <AvatarFallback className={`${getRoleClass(currentUser.role)} bg-muted text-2xl`}>
                        {currentUser.nickname[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className={`text-xl font-bold ${getRoleClass(currentUser.role)}`}>{currentUser.nickname}</h3>
                      <Badge className="mt-1">{getRoleBadge(currentUser.role)}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-primary/30">
                    <p className="text-sm text-muted-foreground">Права доступа:</p>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <Icon name="Check" size={16} className="text-primary" />
                        Полный доступ к управлению
                      </li>
                      <li className="flex items-center gap-2">
                        <Icon name="Check" size={16} className="text-primary" />
                        Управление ролями
                      </li>
                      <li className="flex items-center gap-2">
                        <Icon name="Check" size={16} className="text-primary" />
                        Очистка чата
                      </li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video bg-card rounded-lg overflow-hidden border border-primary/30 neon-border">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                <Icon name="Play" size={64} className="text-primary animate-neon-pulse" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                <h2 className="text-xl font-orbitron text-primary">Видео трансляция</h2>
                <p className="text-sm text-muted-foreground">Загрузите видео через админ панель</p>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-primary/30 p-4">
              <h3 className="text-lg font-orbitron text-primary mb-4">Голосование за следующее видео</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Проголосовало: 0 человек</p>
                <div className="text-center text-muted-foreground py-8">
                  Нет активных голосований
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-primary/30 h-[calc(100vh-200px)] flex flex-col">
              <div className="p-4 border-b border-primary/30">
                <h3 className="text-lg font-orbitron text-primary">Чат</h3>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div key={message.id} className="group animate-fade-in">
                      <div className="flex items-start gap-2">
                        <Avatar className="h-8 w-8 border border-primary/30">
                          <AvatarFallback className={`${getRoleClass(message.user.role)} bg-muted text-xs`}>
                            {message.user.nickname[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className={`font-semibold text-sm ${getRoleClass(message.user.role)}`}>
                              {message.user.nickname}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm mt-1 break-words">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-primary/30">
                <div className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Введите сообщение..."
                    className="flex-1 bg-background border-primary/30"
                  />
                  <Button 
                    onClick={sendMessage}
                    className="bg-primary text-primary-foreground hover:bg-primary/80"
                  >
                    <Icon name="Send" size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
