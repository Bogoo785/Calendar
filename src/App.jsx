import { useEffect, useState } from 'react';

const monthNames = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
];

const CALENDAR_YEAR = 2027;
const DIARY_STORAGE_KEY = 'calendar-diary-entries-v1';

const monthThemes = [
  { season: '冬', title: '雪之神社', image: 'https://loremflickr.com/1200/675/japan,winter,snow?lock=101' },
  { season: '冬', title: '梅花初開', image: 'https://loremflickr.com/1200/675/japan,plum,blossom?lock=102' },
  { season: '春', title: '櫻花滿開', image: 'https://loremflickr.com/1200/675/japan,sakura,cherry-blossom?lock=103' },
  { season: '春', title: '花見河畔', image: 'https://loremflickr.com/1200/675/japan,sakura,river?lock=104' },
  { season: '春', title: '新綠神苑', image: 'https://loremflickr.com/1200/675/japan,shrine,green?lock=105' },
  { season: '夏', title: '紫陽花季', image: 'https://loremflickr.com/1200/675/japan,hydrangea,rainy?lock=106' },
  { season: '夏', title: '夏祭花火', image: 'https://loremflickr.com/1200/675/japan,festival,fireworks?lock=107' },
  { season: '夏', title: '海與向日葵', image: 'https://loremflickr.com/1200/675/japan,sunflower,summer?lock=108' },
  { season: '秋', title: '月見時節', image: 'https://loremflickr.com/1200/675/japan,autumn,moon?lock=109' },
  { season: '秋', title: '紅葉古寺', image: 'https://loremflickr.com/1200/675/japan,maple,autumn?lock=110' },
  { season: '秋', title: '銀杏大道', image: 'https://loremflickr.com/1200/675/japan,ginkgo,autumn?lock=111' },
  { season: '冬', title: '聖誕樹燈景', image: 'https://loremflickr.com/1200/675/japan,christmas,tree,winter?lock=112' },
];

function getDateKey(monthIndex, day) {
  const month = String(monthIndex + 1).padStart(2, '0');
  const dayText = String(day).padStart(2, '0');
  return `${CALENDAR_YEAR}-${month}-${dayText}`;
}

function createEmptyEntry() {
  return { todos: [], note: '' };
}

function MonthSelector({ selectedMonth, onSelectMonth }) {
  return (
    <div className="flex w-full items-center gap-2">
      <label htmlFor="month-select" className="text-sm font-semibold text-slate-600">
        選擇月份
      </label>
      <select
        id="month-select"
        value={selectedMonth}
        onChange={(event) => onSelectMonth(Number(event.target.value))}
        className="min-w-0 flex-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-blue-500"
      >
        {monthNames.map((month, idx) => (
          <option key={month} value={idx}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
}

function MonthDetail({
  month,
  monthIndex,
  image,
  onImageChange,
  isImageLoaded,
  onImageLoaded,
  selectedDay,
  onSelectDay,
  getDayTodos,
}) {
  const daysInMonth = new Date(CALENDAR_YEAR, monthIndex + 1, 0).getDate();
  const firstDay = new Date(CALENDAR_YEAR, monthIndex, 1).getDay();
  const days = [];

  for (let i = 0; i < firstDay; i += 1) days.push(null);
  for (let i = 1; i <= daysInMonth; i += 1) days.push(i);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(monthIndex, reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl bg-white p-4 shadow-lg">
        <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-200 sm:h-64">
          {image ? (
            <>
              <div className={`absolute inset-0 bg-slate-200 transition-opacity ${isImageLoaded ? 'opacity-0' : 'animate-pulse opacity-100'}`} />
              <img
                src={image}
                alt={`${month} 圖片`}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onLoad={() => onImageLoaded(monthIndex)}
                onError={() => onImageLoaded(monthIndex)}
                className={`h-full w-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </>
          ) : (
            <div className="text-center text-slate-500">
              <div className="mb-2 text-4xl">IMAGE</div>
              <p className="text-sm">點擊這裡上傳 {month} 圖片</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>
        <div className="mt-3 flex items-center justify-between rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <span>{monthThemes[monthIndex].title}</span>
          <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-semibold">{monthThemes[monthIndex].season}</span>
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow-lg sm:p-6">
        <h2 className="mb-3 text-2xl font-bold text-blue-600 sm:mb-4 sm:text-3xl">{month}</h2>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
            <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 sm:text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((day, idx) => {
            const todos = day ? getDayTodos(day) : [];
            return day ? (
              <button
                key={`${month}-${idx}`}
                type="button"
                onClick={() => onSelectDay(day)}
                className={`relative flex min-h-10 w-full flex-col items-center rounded-md px-0.5 py-1 text-xs font-medium sm:min-h-12 sm:text-sm ${
                  selectedDay === day
                    ? 'bg-blue-500 text-white ring-2 ring-blue-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <span className="font-semibold">{day}</span>
                {todos.length > 0 && (
                  <ul className="mt-0.5 w-full space-y-0.5">
                    {todos.map((todo) => (
                      <li
                        key={todo.id}
                        className={`truncate rounded text-left text-[10px] leading-tight px-0.5 ${
                          selectedDay === day ? 'bg-blue-400 text-white' : 'bg-white text-blue-700'
                        } ${todo.done ? 'line-through opacity-50' : ''}`}
                      >
                        {todo.text}
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            ) : (
              <div key={`${month}-${idx}`} className="min-h-10 sm:min-h-12" />
            );
          })}
        </div>
      </section>
    </div>
  );
}

function DayPlanner({ selectedDateLabel, entry, onAddTodo, onToggleTodo, onDeleteTodo, onSetNote }) {
  const [todoInput, setTodoInput] = useState('');
  const [editingNote, setEditingNote] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  const handleStartEdit = () => {
    setNoteInput(entry.note ?? '');
    setEditingNote(true);
  };

  const handleConfirmNote = () => {
    onSetNote(noteInput);
    setEditingNote(false);
  };

  const handleAddTodo = () => {
    const trimmed = todoInput.trim();
    if (!trimmed) return;
    onAddTodo(trimmed);
    setTodoInput('');
  };

  return (
    <section className="mt-4 rounded-xl bg-white p-4 shadow-lg sm:mt-6 sm:p-5">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-slate-800 sm:text-xl">{selectedDateLabel}</h3>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-600">待辦事項</p>
        <div className="mb-3 flex gap-2">
          <input
            type="text"
            value={todoInput}
            onChange={(event) => setTodoInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleAddTodo();
            }}
            placeholder="輸入今天要做的事"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleAddTodo}
            className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          >
            新增
          </button>
        </div>

        <ul className="space-y-2">
          {entry.todos.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className={`text-sm ${todo.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{todo.text}</span>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => onToggleTodo(todo.id)}
                  className={`rounded-md px-2 py-1 text-xs ${todo.done ? 'text-slate-400 hover:bg-slate-100' : 'text-green-600 hover:bg-green-50'}`}
                >
                  {todo.done ? '取消' : '完成'}
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTodo(todo.id)}
                  className="rounded-md px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                >
                  刪除
                </button>
              </div>
            </li>
          ))}
          {entry.todos.length === 0 && (
            <li className="rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-500">這一天還沒有待辦事項</li>
          )}
        </ul>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">心情紀錄</p>
          {!editingNote && (
            <button
              type="button"
              onClick={handleStartEdit}
              className="rounded-md px-2 py-1 text-xs text-blue-500 hover:bg-blue-50"
            >
              撰寫
            </button>
          )}
        </div>
        {editingNote ? (
          <>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              rows={4}
              autoFocus
              placeholder="今天心情怎麼樣？"
              className="w-full resize-none rounded-lg border border-blue-400 px-3 py-2 text-sm outline-none"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingNote(false)}
                className="rounded-md px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmNote}
                className="rounded-md bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600"
              >
                確定
              </button>
            </div>
          </>
        ) : (
          <div className="min-h-16 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 whitespace-pre-wrap">
            {entry.note ? entry.note : <span className="text-slate-400">還沒有心情紀錄</span>}
          </div>
        )}
      </div>
    </section>
  );
}

function App() {
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date();
    return today.getFullYear() === CALENDAR_YEAR ? today.getDate() : 1;
  });
  const [images, setImages] = useState(() => monthThemes.map((theme) => theme.image));
  const [loadedState, setLoadedState] = useState(() => monthThemes.map(() => false));
  const [diaryEntries, setDiaryEntries] = useState(() => {
    try {
      const raw = localStorage.getItem(DIARY_STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed ? parsed : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    images.forEach((src, idx) => {
      if (!src || loadedState[idx]) return;

      const preloader = new Image();
      preloader.src = src;
      preloader.onload = () => {
        setLoadedState((prev) => {
          if (prev[idx]) return prev;
          const next = [...prev];
          next[idx] = true;
          return next;
        });
      };
      preloader.onerror = () => {
        setLoadedState((prev) => {
          if (prev[idx]) return prev;
          const next = [...prev];
          next[idx] = true;
          return next;
        });
      };
    });
  }, [images, loadedState]);

  useEffect(() => {
    localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  useEffect(() => {
    const maxDay = new Date(CALENDAR_YEAR, selectedMonth + 1, 0).getDate();
    setSelectedDay((prev) => {
      if (prev < 1) return 1;
      if (prev > maxDay) return maxDay;
      return prev;
    });
  }, [selectedMonth]);

  const handleImageChange = (monthIndex, imageData) => {
    setImages((prev) => {
      const next = [...prev];
      next[monthIndex] = imageData;
      return next;
    });

    setLoadedState((prev) => {
      const next = [...prev];
      next[monthIndex] = false;
      return next;
    });
  };

  const handleImageLoaded = (monthIndex) => {
    setLoadedState((prev) => {
      if (prev[monthIndex]) return prev;
      const next = [...prev];
      next[monthIndex] = true;
      return next;
    });
  };

  const selectedDateKey = getDateKey(selectedMonth, selectedDay);
  const selectedEntry = diaryEntries[selectedDateKey] ?? createEmptyEntry();

  const getDayTodos = (day) => {
    const key = getDateKey(selectedMonth, day);
    const entry = diaryEntries[key];
    return entry?.todos ?? [];
  };

  const setEntryForSelectedDay = (updater) => {
    setDiaryEntries((prev) => {
      const current = prev[selectedDateKey] ?? createEmptyEntry();
      const nextEntry = updater(current);
      return {
        ...prev,
        [selectedDateKey]: nextEntry,
      };
    });
  };

  const handleAddTodo = (text) => {
    setEntryForSelectedDay((current) => ({
      ...current,
      todos: [{ id: `${Date.now()}-${Math.random()}`, text, done: false }, ...current.todos],
    }));
  };

  const handleToggleTodo = (todoId) => {
    setEntryForSelectedDay((current) => ({
      ...current,
      todos: current.todos.map((todo) => (todo.id === todoId ? { ...todo, done: !todo.done } : todo)),
    }));
  };

  const handleDeleteTodo = (todoId) => {
    setEntryForSelectedDay((current) => ({
      ...current,
      todos: current.todos.filter((todo) => todo.id !== todoId),
    }));
  };

  const handleSetNote = (text) => {
    setEntryForSelectedDay((current) => ({
      ...current,
      note: text,
    }));
  };

  const selectedDateLabel = `${CALENDAR_YEAR} / ${selectedMonth + 1} / ${selectedDay}`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-4 text-center sm:mb-8">
          <h1 className="mb-2 text-2xl font-bold text-slate-800 sm:text-5xl">{CALENDAR_YEAR} 月曆</h1>
        </header>

        <section className="mb-4 rounded-xl bg-white p-3 shadow-lg sm:mb-6 sm:p-5">
          <MonthSelector selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />
        </section>

        <MonthDetail
          month={monthNames[selectedMonth]}
          monthIndex={selectedMonth}
          image={images[selectedMonth]}
          onImageChange={handleImageChange}
          isImageLoaded={loadedState[selectedMonth]}
          onImageLoaded={handleImageLoaded}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          getDayTodos={getDayTodos}
        />

        <DayPlanner
          selectedDateLabel={selectedDateLabel}
          entry={selectedEntry}
          onAddTodo={handleAddTodo}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          onSetNote={handleSetNote}
        />
      </div>
    </main>
  );
}

export default App;

