import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

type Role = 'user' | 'junior-admin' | 'admin' | 'senior-admin' | 'creator';

interface User {
  id: string;
  nickname: string;
  email?: string;
  role: Role;
  canWrite: boolean;
}

interface Message {
  id: string;
  user: User;
  text: string;
  timestamp: Date;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginNickname, setLoginNickname] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerNickname, setRegisterNickname] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    nickname: 'Создатель',
    role: 'creator',
    canWrite: true
  });

  const [users, setUsers] = useState<User[]>([
    { id: '2', nickname: 'Пользователь1', role: 'user', canWrite: true },
    { id: '3', nickname: 'МладшийАдмин', role: 'junior-admin', canWrite: true },
    { id: '4', nickname: 'Админ', role: 'admin', canWrite: true },
    { id: '5', nickname: 'СтаршийАдмин', role: 'senior-admin', canWrite: true }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: { id: '2', nickname: 'Пользователь1', role: 'user', canWrite: true },
      text: 'Привет всем!',
      timestamp: new Date()
    },
    {
      id: '2',
      user: { id: '3', nickname: 'МладшийАдмин', role: 'junior-admin', canWrite: true },
      text: 'Добро пожаловать на VELSGOT!',
      timestamp: new Date()
    }
  ]);

  const [messageInput, setMessageInput] = useState('');
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isChatEnabled, setIsChatEnabled] = useState(true);
  const [currentVideo, setCurrentVideo] = useState('');
  const [searchNickname, setSearchNickname] = useState('');

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

  const canAccessAdminPanel = (role: Role): boolean => {
    return ['junior-admin', 'admin', 'senior-admin', 'creator'].includes(role);
  };

  const canChangeVideo = (role: Role): boolean => {
    return ['senior-admin', 'creator'].includes(role);
  };

  const canDeleteUser = (userRole: Role, targetRole: Role): boolean => {
    if (userRole === 'creator') return true;
    if (userRole === 'admin' && targetRole === 'user') return true;
    return false;
  };

  const canChangeRole = (role: Role): boolean => {
    return role === 'creator';
  };

  const canBanUser = (userRole: Role, targetRole: Role): boolean => {
    if (userRole === 'creator') return true;
    if (userRole === 'senior-admin' && ['user', 'junior-admin', 'admin'].includes(targetRole)) return true;
    return false;
  };

  const canMuteUser = (userRole: Role, targetRole: Role): boolean => {
    if (userRole === 'creator') return true;
    if (userRole === 'senior-admin' && ['user', 'junior-admin', 'admin'].includes(targetRole)) return true;
    if (userRole === 'admin' && ['user', 'junior-admin'].includes(targetRole)) return true;
    if (userRole === 'junior-admin' && targetRole === 'user') return true;
    return false;
  };

  const handleLogin = () => {
    if (loginNickname && loginPassword) {
      setCurrentUser({
        id: Date.now().toString(),
        nickname: loginNickname,
        role: 'creator',
        canWrite: true
      });
      setIsLoggedIn(true);
      setLoginNickname('');
      setLoginPassword('');
    }
  };

  const handleRegister = () => {
    if (registerNickname && registerEmail && registerPassword) {
      setCurrentUser({
        id: Date.now().toString(),
        nickname: registerNickname,
        email: registerEmail,
        role: 'user',
        canWrite: true
      });
      setIsLoggedIn(true);
      setRegisterNickname('');
      setRegisterEmail('');
      setRegisterPassword('');
      setIsRegistering(false);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() && currentUser.canWrite && isChatEnabled) {
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

  const clearChat = () => {
    if (currentUser.role === 'creator') {
      setMessages([]);
    }
  };

  const deleteMessage = (messageId: string) => {
    if (currentUser.role === 'creator') {
      setMessages(messages.filter(msg => msg.id !== messageId));
    }
  };

  const toggleUserWrite = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, canWrite: !user.canWrite } : user
    ));
  };

  const changeUserRole = (userId: string, newRole: Role) => {
    if (currentUser.role === 'creator') {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    }
  };

  const deleteUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser && canDeleteUser(currentUser.role, targetUser.role)) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const loadVideo = (videoUrl: string) => {
    if (canChangeVideo(currentUser.role)) {
      setCurrentVideo(videoUrl);
    }
  };

  const filteredUsers = searchNickname
    ? users.filter(u => u.nickname.toLowerCase().includes(searchNickname.toLowerCase()))
    : users;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-4xl font-orbitron font-bold text-center text-primary">
            VELSGOT
          </h1>
          
          {!isRegistering ? (
            <div className="bg-card border border-primary/30 rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-orbitron text-center">Вход</h2>
              <div className="space-y-4">
                <div>
                  <Label>Никнейм</Label>
                  <Input
                    value={loginNickname}
                    onChange={(e) => setLoginNickname(e.target.value)}
                    placeholder="Введите никнейм"
                    className="bg-background border-primary/30"
                  />
                </div>
                <div>
                  <Label>Пароль</Label>
                  <Input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Введите пароль"
                    className="bg-background border-primary/30"
                  />
                </div>
                <Button onClick={handleLogin} className="w-full bg-primary text-primary-foreground">
                  Войти
                </Button>
                <Button 
                  onClick={() => setIsRegistering(true)} 
                  variant="outline" 
                  className="w-full border-primary/30"
                >
                  Зарегистрироваться
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-primary/30 rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-orbitron text-center">Регистрация</h2>
              <div className="space-y-4">
                <div>
                  <Label>Никнейм</Label>
                  <Input
                    value={registerNickname}
                    onChange={(e) => setRegisterNickname(e.target.value)}
                    placeholder="Введите никнейм"
                    className="bg-background border-primary/30"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="Введите email"
                    className="bg-background border-primary/30"
                  />
                </div>
                <div>
                  <Label>Пароль</Label>
                  <Input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Введите пароль"
                    className="bg-background border-primary/30"
                  />
                </div>
                <Button onClick={handleRegister} className="w-full bg-primary text-primary-foreground">
                  Зарегистрироваться
                </Button>
                <Button 
                  onClick={() => setIsRegistering(false)} 
                  variant="outline" 
                  className="w-full border-primary/30"
                >
                  Назад к входу
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-primary/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-primary">
            VELSGOT
          </h1>
          
          <div className="flex items-center gap-4">
            {canAccessAdminPanel(currentUser.role) && (
              <Dialog open={isAdminPanelOpen} onOpenChange={setIsAdminPanelOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/20">
                    <Icon name="Settings" size={20} className="mr-2" />
                    Админ панель
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-red-500/50 max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-orbitron text-red-500">Панель управления</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="users" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="users">Пользователи</TabsTrigger>
                      {canChangeVideo(currentUser.role) && <TabsTrigger value="video">Видео</TabsTrigger>}
                      <TabsTrigger value="chat">Чат</TabsTrigger>
                      <TabsTrigger value="voting">Голосование</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="users" className="space-y-4">
                      {currentUser.role === 'creator' && (
                        <div className="space-y-2">
                          <Label>Поиск по нику</Label>
                          <Input 
                            placeholder="Введите никнейм..." 
                            value={searchNickname}
                            onChange={(e) => setSearchNickname(e.target.value)}
                            className="bg-background border-primary/30" 
                          />
                        </div>
                      )}
                      <ScrollArea className="h-[400px] rounded-md border border-primary/30 p-4">
                        <div className="space-y-3">
                          {filteredUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded bg-muted/30 hover:bg-muted/50">
                              <div className="flex items-center gap-3 flex-1">
                                <Avatar className="h-10 w-10 border border-primary/30">
                                  <AvatarFallback className={`${getRoleClass(user.role)} bg-muted`}>
                                    {user.nickname[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <span className={`font-semibold ${getRoleClass(user.role)}`}>{user.nickname}</span>
                                  <Badge variant="outline" className="ml-2 text-xs">{getRoleBadge(user.role)}</Badge>
                                  {!user.canWrite && <Badge variant="destructive" className="ml-2 text-xs">Заблокирован</Badge>}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {canMuteUser(currentUser.role, user.role) && (
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => toggleUserWrite(user.id)}
                                    className="h-9"
                                    title="Запретить писать"
                                  >
                                    <Icon name={user.canWrite ? "MessageSquareOff" : "MessageSquare"} size={16} />
                                  </Button>
                                )}
                                {canDeleteUser(currentUser.role, user.role) && (
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => deleteUser(user.id)}
                                    className="h-9 text-red-500 hover:text-red-400"
                                    title="Удалить пользователя"
                                  >
                                    <Icon name="Trash2" size={16} />
                                  </Button>
                                )}
                                {canChangeRole(currentUser.role) && (
                                  <Select 
                                    value={user.role}
                                    onValueChange={(newRole) => changeUserRole(user.id, newRole as Role)}
                                  >
                                    <SelectTrigger className="w-[140px] h-9 border-primary/30">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="user">Пользователь</SelectItem>
                                      <SelectItem value="junior-admin">Младший Админ</SelectItem>
                                      <SelectItem value="admin">Админ</SelectItem>
                                      <SelectItem value="senior-admin">Старший Админ</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    {canChangeVideo(currentUser.role) && (
                      <TabsContent value="video" className="space-y-4">
                        <div className="space-y-2">
                          <Label>Загрузить видео из VK Видео</Label>
                          <Input 
                            placeholder="Вставьте ссылку на видео из VK Видео..." 
                            value={currentVideo}
                            onChange={(e) => setCurrentVideo(e.target.value)}
                            className="bg-background border-primary/30" 
                          />
                          <Button 
                            onClick={() => loadVideo(currentVideo)} 
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/80"
                          >
                            <Icon name="Upload" size={20} className="mr-2" />
                            Загрузить видео
                          </Button>
                        </div>
                        {currentVideo && (
                          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                            <p className="text-sm text-muted-foreground">Текущее видео:</p>
                            <p className="text-sm mt-1 break-all">{currentVideo}</p>
                          </div>
                        )}
                      </TabsContent>
                    )}
                    
                    <TabsContent value="chat" className="space-y-4">
                      {currentUser.role === 'creator' && (
                        <>
                          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                            <div className="space-y-1">
                              <Label>Включить/выключить чат</Label>
                              <p className="text-sm text-muted-foreground">
                                {isChatEnabled ? 'Чат включен для всех' : 'Чат выключен'}
                              </p>
                            </div>
                            <Switch
                              checked={isChatEnabled}
                              onCheckedChange={setIsChatEnabled}
                            />
                          </div>
                          <Button 
                            onClick={clearChat} 
                            variant="destructive"
                            className="w-full"
                          >
                            <Icon name="Trash2" size={20} className="mr-2" />
                            Очистить весь чат
                          </Button>
                        </>
                      )}
                      <div className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg">
                        <p>Сообщений в чате: {messages.length}</p>
                        <p className="mt-2">Статус чата: {isChatEnabled ? '🟢 Активен' : '🔴 Отключен'}</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="voting" className="space-y-4">
                      <div className="space-y-2">
                        <Label>Создать голосование</Label>
                        <Input placeholder="Название видео 1" className="bg-background border-primary/30" />
                        <Input placeholder="Название видео 2" className="bg-background border-primary/30" />
                        <Input placeholder="Название видео 3" className="bg-background border-primary/30" />
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/80">
                          <Icon name="Vote" size={20} className="mr-2" fallback="CheckSquare" />
                          Создать голосование
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            )}

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
                      {currentUser.role === 'creator' && (
                        <>
                          <li className="flex items-center gap-2">
                            <Icon name="Check" size={16} className="text-primary" />
                            Полный доступ к управлению
                          </li>
                          <li className="flex items-center gap-2">
                            <Icon name="Check" size={16} className="text-primary" />
                            Управление ролями и видео
                          </li>
                          <li className="flex items-center gap-2">
                            <Icon name="Check" size={16} className="text-primary" />
                            Очистка и управление чатом
                          </li>
                        </>
                      )}
                      {currentUser.role === 'senior-admin' && (
                        <>
                          <li className="flex items-center gap-2">
                            <Icon name="Check" size={16} className="text-primary" />
                            Блокировка пользователей
                          </li>
                          <li className="flex items-center gap-2">
                            <Icon name="Check" size={16} className="text-primary" />
                            Изменение видео
                          </li>
                        </>
                      )}
                      {currentUser.role === 'admin' && (
                        <li className="flex items-center gap-2">
                          <Icon name="Check" size={16} className="text-primary" />
                          Удаление пользователей и сообщений
                        </li>
                      )}
                      {currentUser.role === 'junior-admin' && (
                        <li className="flex items-center gap-2">
                          <Icon name="Check" size={16} className="text-primary" />
                          Удаление сообщений в чате
                        </li>
                      )}
                    </ul>
                  </div>
                  <Button 
                    onClick={() => setIsLoggedIn(false)} 
                    variant="outline" 
                    className="w-full"
                  >
                    Выйти
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video bg-card rounded-lg overflow-hidden border border-primary/30">
              {currentVideo ? (
                <iframe
                  src={currentVideo}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                    <Icon name="Play" size={64} className="text-primary" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                    <h2 className="text-xl font-orbitron text-primary">Видео трансляция</h2>
                    <p className="text-sm text-muted-foreground">Загрузите видео через админ панель</p>
                  </div>
                </>
              )}
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
              <div className="p-4 border-b border-primary/30 flex items-center justify-between">
                <h3 className="text-lg font-orbitron text-primary">Чат</h3>
                {!isChatEnabled && (
                  <Badge variant="destructive">Отключен</Badge>
                )}
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
                            {currentUser.role === 'creator' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteMessage(message.id)}
                                className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                              >
                                <Icon name="X" size={12} />
                              </Button>
                            )}
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
                    placeholder={!isChatEnabled ? "Чат отключен" : !currentUser.canWrite ? "Вам запрещено писать" : "Введите сообщение..."}
                    className="flex-1 bg-background border-primary/30"
                    disabled={!isChatEnabled || !currentUser.canWrite}
                  />
                  <Button 
                    onClick={sendMessage}
                    className="bg-primary text-primary-foreground hover:bg-primary/80"
                    disabled={!isChatEnabled || !currentUser.canWrite}
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
