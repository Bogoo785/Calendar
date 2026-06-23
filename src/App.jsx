import { useEffect, useState } from 'react';

const monthNames = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
];

const CALENDAR_YEAR = 2027;

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

function MonthSelector({ selectedMonth, onSelectMonth }) {
  return (
    <div className="inline-flex items-center gap-2">
      <label htmlFor="month-select" className="text-sm font-semibold text-slate-600">
        選擇月份
      </label>
      <select
        id="month-select"
        value={selectedMonth}
        onChange={(event) => onSelectMonth(Number(event.target.value))}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-blue-500"
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

function MonthDetail({ month, monthIndex, image, onImageChange, isImageLoaded, onImageLoaded }) {
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
        <div className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-200 sm:h-64">
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
        <h2 className="mb-4 text-3xl font-bold text-blue-600">{month}</h2>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
            <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 sm:text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((day, idx) => (
            <div
              key={`${month}-${idx}`}
              className={`flex aspect-square items-center justify-center rounded-md text-sm font-medium sm:text-base ${
                day ? 'bg-blue-100 text-blue-700' : 'bg-transparent'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function App() {
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth());
  const [images, setImages] = useState(() => monthThemes.map((theme) => theme.image));
  const [loadedState, setLoadedState] = useState(() => monthThemes.map(() => false));

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 text-center sm:mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-800 sm:text-5xl">{CALENDAR_YEAR} 月曆</h1>
        </header>

        <section className="mb-6 rounded-xl bg-white p-4 shadow-lg sm:p-5">
          <MonthSelector selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />
        </section>

        <MonthDetail
          month={monthNames[selectedMonth]}
          monthIndex={selectedMonth}
          image={images[selectedMonth]}
          onImageChange={handleImageChange}
          isImageLoaded={loadedState[selectedMonth]}
          onImageLoaded={handleImageLoaded}
        />
      </div>
    </main>
  );
}

export default App;
