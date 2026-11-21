(() => {
  'use strict';
  const STORAGE_KEY = 'meridian.owner-workbook.v1';
  const SCHEMA = 'meridian-owner-workbook';
  const MAX_ANSWER = 8000;
  const sections = [
    { id: 'essentials', title: '10 главных вопросов', short: 'Начать здесь', eyebrow: '01 · Основа запуска', intro: 'Этого достаточно для первого предметного разговора. Не нужно выяснять всё за один вечер.', questions: [
      ['stores', 'Где находятся магазины и как с вами связаться?', 'Чтобы на сайте были настоящие адреса, часы работы и понятный способ связаться с живым человеком.', 'Город, два адреса, часы работы, телефон и публичные контакты. Кто ответит покупателю из другого города?'],
      ['goal', 'Какой результат через три месяца будет для тебя успехом?', 'Выберем измеримую цель, а не просто красивый сайт.', 'Например: первые 30 отправленных заказов, повторные покупки или определённая прибыль. Какие товары и регионы важнее на старте?'],
      ['assortment', 'Какие 20 ароматов покупают чаще всего?', 'Начнём с ассортимента, в котором ты уверен: его проще показать, поддерживать в наличии и продвигать.', 'Бренд + название + концентрация + объём + текущая розничная цена. Какие позиции стабильно есть, а какие быстро заканчиваются? Можно подготовить отдельную таблицу.'],
      ['advantage', 'Почему покупатели возвращаются именно к вам?', 'Твои реальные преимущества должны быть заметны человеку, который впервые слышит о «Меридиане».', 'Что люди говорят после покупки? За счёт чего цена доступнее? Есть ли характерная история: попробовал в другом магазине, купил у вас?'],
      ['authenticity', 'Чем мы можем подтвердить оригинальность?', 'Онлайн-покупателю нужны проверяемые основания доверять магазину.', 'Какие документы можно показывать, какие фото упаковки и маркировки есть? Можно ли снять видео из магазинов? Не прикладывай договоры и данные поставщиков к публичной странице.'],
      ['accounting', 'Какая именно 1С у вас работает и кто её обслуживает?', 'От этого зависит обмен товарами, ценами, остатками и заказами. Если 1С нет, выберем систему учёта отдельно.', 'Название конфигурации, версия, облако или ваш компьютер/сервер; есть ли специалист. Достаточно названия, без паролей и ключей. Используете ли МойСклад?'],
      ['inventory', 'Как сейчас учитываются остатки двух магазинов?', 'Нужно избежать ситуации, когда один флакон одновременно продан в магазине и заказан на сайте.', 'Одна база или две? Когда обновляется остаток? Есть ли резерв, перемещения между точками и отдельный склад для интернет-заказов? Какая система должна быть главной?'],
      ['operator', 'Кто будет отвечать за заказ от заявки до вручения?', 'Автоматизация должна помогать конкретным людям. Ошибки и нестандартные ситуации всё равно кому-то нужно решать.', 'Кто подтверждает заказ, собирает, упаковывает и передаёт перевозчику? В какие часы? Кто подменяет этого человека?'],
      ['shipping', 'Как вы готовы отправлять заказы по стране?', 'Покупатель должен заранее видеть реальную стоимость и срок, а магазин — понимать расходы.', 'Какие перевозчики и способы доставки уже доступны? Из какого города отправка? ПВЗ или курьер? Какие ограничения перевозчика надо уточнить именно для парфюмерии?'],
      ['economics', 'Сколько магазин может потратить на получение и выполнение заказа?', 'Низкая цена должна оставлять прибыль после доставки, упаковки, оплаты и рекламы.', 'Кто посчитает допустимые расходы и скидку? Готов ли ты отдельно дать закрытую таблицу с закупкой, розницей, комиссиями и упаковкой? Здесь точные закупочные цены не нужны.']
    ]},
    { id: 'catalogue', title: 'Ассортимент, который удобно покупать', short: 'Каталог и доверие', eyebrow: '02 · Что видит покупатель', intro: 'Подумай о человеке, который знает свой аромат, и о человеке, который пока выбирает подарок.', questions: [
      ['variants', 'Какие форматы действительно продаёте?', 'Флакон, тестер, набор, миниатюра и пробник должны быть однозначно названы и иметь свои остатки.', 'Какие объёмы, концентрации и наборы есть? Продаёте ли тестеры или отливанты? Что точно не будем размещать?'],
      ['content', 'Кто поможет собрать реальные фото и описания?', 'Уточним, какие материалы можно опубликовать и кто проверит, что карточка соответствует товару.', 'Есть ли ваши фото флаконов и двух магазинов, видео распаковки, история магазина? Кто проверяет название, объём, концентрацию и комплектность?'],
      ['availability', 'Что показываем, когда аромат закончился?', 'Не будем обещать товар, которого нельзя отгрузить.', 'Скрывать, показывать «нет в наличии», предлагать уведомление? Возможен ли заказ под клиента, и кто реально подтвердит срок?'],
      ['pricing', 'Как устроены цены, скидки и программа лояльности?', 'На сайте и в магазине не должно быть неожиданных расхождений, которые никто не может объяснить.', 'Цена онлайн такая же? Есть карта постоянного покупателя? Кто может менять цену? Какие скидки нельзя складывать? Нужен ли общий баланс для двух магазинов и сайта?']
    ]},
    { id: 'operations', title: 'Заказ без ручной суеты', short: 'Заказы и сервис', eyebrow: '03 · Что происходит за кулисами', intro: 'Пройдём весь путь: покупатель нажал кнопку, вы получили заказ, флакон доехал целым.', questions: [
      ['packaging', 'Как упаковываем флакон и что предлагаем для подарка?', 'Упаковка влияет на сохранность, впечатление и стоимость заказа.', 'Есть ли проверенная защитная упаковка, её стоимость и запас? Нужны ли подарочная коробка, открытка, возможность убрать цену из вложений?'],
      ['exceptions', 'Что делаем при повреждении, ошибке или отмене?', 'Договоримся о понятном порядке действий и ответственном человеке до первого такого случая.', 'Кто принимает обращение, какие сведения просит, когда отвечает? Какие условия возврата и претензий нужно подтвердить с вашим специалистом? Кто ведёт спор с перевозчиком?'],
      ['payment', 'Как покупатель будет платить?', 'Поймём, какие подключения уже есть и что понадобится для онлайн-оплаты.', 'Есть ли интернет-эквайринг, СБП, онлайн-касса и специалист по подключению? Какие способы нужны на старте? Только названия сервисов, без доступов.'],
      ['notifications', 'Какие сообщения нужны покупателю и сотрудникам?', 'Уведомления должны отвечать на вопросы о заказе и помогать вовремя заметить проблему.', 'Подтверждение, оплата, сборка, трек-номер, задержка. Куда покупателю удобно писать? Кто увидит сбой оплаты или обмена с 1С?'],
      ['documents', 'Как сейчас устроены документы и маркировка?', 'Перед запуском проверим требования и совместимость ваших рабочих процессов с интернет-продажами.', 'Какие категории маркируются, кто отвечает за коды, кассу и документы? Кто со стороны магазина проверит требования к отправке, оплате, возвратам и обработке данных?']
    ]},
    { id: 'growth', title: 'Первый рост и следующие идеи', short: 'Рост и идеи', eyebrow: '04 · Что проверяем первым', intro: 'Сначала найдём рабочую модель на небольшом объёме заказов. Затем усилим то, что действительно приносит результат.', questions: [
      ['retention', 'Как поддерживать связь с покупателем после заказа?', 'Повторная покупка часто начинается с хорошего первого опыта, а не с новой скидки.', 'Есть ли уже клиентская база и согласия на сообщения? Нужны ли история покупок, повтор заказа, рекомендации, напоминание о любимом аромате?'],
      ['budget', 'Какой бюджет и сколько времени команды есть на запуск?', 'Выберем объём работ, который магазин сможет поддерживать.', 'Какой диапазон бюджета на сайт, подключения, фото и первый трафик? Кто принимает решения и сколько времени готов уделять в неделю?'],
      ['experiment', 'С какого небольшого эксперимента начнём?', 'Нужен способ проверить спрос и весь путь заказа до масштабной рекламы.', 'Например: ограниченный каталог, один канал привлечения и первые 10–20 заказов. По каким результатам решим продолжать, менять предложение или остановить тест?'],
      ['prototype', 'Что в новом макете помогает купить, а что мешает?', 'Твои наблюдения и мнение реального покупателя помогут улучшить следующую версию.', 'Попробуй найти знакомый аромат, выбрать подарок, сравнить два флакона и оформить пробный заказ. Где возникли вопросы? Что хочется добавить или убрать?'],
      ['ideas', 'Какие идеи пришли по ходу разговора?', 'Это место для «а что, если…». Не всё нужно делать сразу — хорошие идеи сохраним.', 'Что клиенты спрашивают постоянно? Какой сервис в магазине они особенно ценят? Что можно перенести в онлайн? Какая мысль пришла уже после заполнения?']
    ]}
  ];
  const allQuestions = sections.flatMap(section => section.questions);
  const validIds = new Set(allQuestions.map(question => question[0]));
  const form = document.getElementById('questions');
  const saveStatus = document.getElementById('save-status');
  const fileStatus = document.getElementById('file-status');
  let answers = Object.create(null);
  let pendingConfirmation = null;
  let persistTimer;

  function cleanAnswers(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('В файле нет объекта с ответами.');
    const clean = Object.create(null);
    for (const [id, value] of Object.entries(input)) {
      if (!validIds.has(id)) continue;
      if (typeof value !== 'string' || value.length > MAX_ANSWER) throw new Error('Ответы должны быть текстом не длиннее 8 000 символов.');
      clean[id] = value;
    }
    return clean;
  }

  function setSaveStatus(message, error = false) {
    saveStatus.textContent = message;
    saveStatus.classList.toggle('error', error);
  }

  function setFileStatus(message, error = false) {
    fileStatus.textContent = message;
    fileStatus.classList.toggle('error', error);
  }

  function persist() {
    clearTimeout(persistTimer);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ schema: SCHEMA, version: 1, savedAt: new Date().toISOString(), answers }));
      setSaveStatus('Сохранено в этом браузере. Чтобы поделиться, скачай ответы.');
    } catch {
      setSaveStatus('Браузер не разрешил сохранить ответы. Скачай текст или JSON перед закрытием страницы.', true);
    }
  }

  function readSaved() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (parsed.schema !== SCHEMA || parsed.version !== 1) throw new Error('Unsupported version');
      answers = cleanAnswers(parsed.answers);
      setSaveStatus('Восстановлены ответы, сохранённые в этом браузере.');
    } catch {
      setSaveStatus('Не удалось прочитать сохранённые ответы. Можно начать заново или загрузить резервную копию JSON.', true);
    }
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function render() {
    let number = 0;
    for (const section of sections) {
      const wrapper = el('section', 'question-section');
      wrapper.id = section.id;
      const heading = el('div', 'section-heading');
      const title = el('h2', '', section.title);
      title.id = section.id + '-heading';
      wrapper.setAttribute('aria-labelledby', title.id);
      heading.append(el('p', 'eyebrow', section.eyebrow), title, el('p', '', section.intro));
      wrapper.append(heading);
      for (const [id, question, hint, placeholder] of section.questions) {
        number += 1;
        const block = el('div', 'question');
        const label = el('label', 'question-label');
        label.htmlFor = 'answer-' + id;
        label.append(el('span', 'question-number', String(number).padStart(2, '0')), el('span', '', question));
        const hintNode = el('p', 'question-hint', hint);
        hintNode.id = 'hint-' + id;
        const input = el('textarea');
        input.id = 'answer-' + id;
        input.name = id;
        input.rows = 3;
        input.maxLength = MAX_ANSWER;
        input.placeholder = placeholder;
        input.value = answers[id] || '';
        input.setAttribute('aria-describedby', hintNode.id);
        const printAnswer = el('p', 'print-answer', input.value.trim() || 'Пока без ответа.');
        printAnswer.id = 'print-' + id;
        input.addEventListener('input', () => {
          answers[id] = input.value;
          printAnswer.textContent = input.value.trim() || 'Пока без ответа.';
          updateProgress();
          clearTimeout(persistTimer);
          setSaveStatus('Сохраняем в этом браузере…');
          persistTimer = setTimeout(persist, 250);
        });
        block.append(label, hintNode, input, printAnswer);
        wrapper.append(block);
      }
      form.append(wrapper);
      const navLink = el('a');
      navLink.href = '#' + section.id;
      navLink.append(el('b', '', section.short), el('span', '', section.questions.length + ' вопросов'));
      document.getElementById('section-nav').append(navLink);
    }
  }

  function updateProgress() {
    const filled = allQuestions.filter(([id]) => (answers[id] || '').trim()).length;
    const essentials = sections[0].questions.filter(([id]) => (answers[id] || '').trim()).length;
    document.getElementById('answered-count').textContent = String(filled);
    document.getElementById('answer-progress').value = filled;
    document.getElementById('essential-progress').textContent = `Главные вопросы: ${essentials} из 10`;
  }

  function syncFields() {
    for (const [id] of allQuestions) {
      document.getElementById('answer-' + id).value = answers[id] || '';
      document.getElementById('print-' + id).textContent = (answers[id] || '').trim() || 'Пока без ответа.';
    }
    updateProgress();
  }

  function markdown() {
    let count = 0;
    const lines = ['# Меридиан — ответы владельца', '', 'Выгружено: ' + new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' }), '', 'Рабочий документ. Перед отправкой проверь, кому передаёшь ответы.', 'Можно отвечать по частям. «Не знаю» — нормальный ответ. Пароли и ключи не нужны.', ''];
    for (const section of sections) {
      lines.push('## ' + section.title, '', section.intro, '');
      for (const [id, question, why, prompt] of section.questions) {
        count += 1;
        lines.push('### ' + count + '. ' + question, '', 'Зачем: ' + why, '', 'Подсказка: ' + prompt, '', '**Ответ:**', '', (answers[id] || '').trim() || 'Пока без ответа.', '');
      }
    }
    return lines.join('\n');
  }

  function download(content, filename, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFileStatus('Файл подготовлен к скачиванию. Чтобы поделиться ответами, отправь его другу самостоятельно.');
  }

  function confirmAction(title, message, action, acceptLabel) {
    const dialog = document.getElementById('confirm-dialog');
    pendingConfirmation = action;
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-description').textContent = message;
    document.getElementById('confirm-accept').textContent = acceptLabel;
    dialog.showModal();
    document.getElementById('confirm-cancel').focus();
  }

  document.getElementById('confirm-cancel').addEventListener('click', () => {
    pendingConfirmation = null;
    document.getElementById('confirm-dialog').close();
  });
  document.getElementById('confirm-dialog').addEventListener('cancel', () => { pendingConfirmation = null; });
  document.getElementById('confirm-accept').addEventListener('click', () => {
    const action = pendingConfirmation;
    pendingConfirmation = null;
    document.getElementById('confirm-dialog').close();
    if (action) action();
  });
  document.getElementById('download-md').addEventListener('click', () => download(markdown(), 'meridian-answers.md', 'text/markdown;charset=utf-8'));
  document.getElementById('download-json').addEventListener('click', () => download(JSON.stringify({ schema: SCHEMA, version: 1, savedAt: new Date().toISOString(), answers }, null, 2), 'meridian-answers.json', 'application/json;charset=utf-8'));
  document.getElementById('print-button').addEventListener('click', () => window.print());
  document.getElementById('import-button').addEventListener('click', () => document.getElementById('import-file').click());
  document.getElementById('import-file').addEventListener('change', async event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 2000000) throw new Error('Файл слишком большой. Выбери резервную копию JSON, скачанную с этой страницы.');
      const parsed = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== 'object' || parsed.schema !== SCHEMA || parsed.version !== 1) throw new Error('Это не резервная копия этой тетради или у неё другая версия.');
      const imported = cleanAnswers(parsed.answers);
      const apply = () => {
        answers = imported;
        syncFields();
        persist();
        setFileStatus('Ответы загружены. Можно продолжать заполнение.');
      };
      if (allQuestions.some(([id]) => (answers[id] || '').trim())) {
        confirmAction('Заменить текущие ответы?', 'Ответы из файла заменят заполненное в этой тетради. При необходимости сначала скачай текущую резервную копию.', apply, 'Загрузить');
      } else apply();
    } catch (error) {
      setFileStatus('Не удалось загрузить файл. ' + (error instanceof SyntaxError ? 'Проверь, что это корректный JSON.' : error.message), true);
    } finally {
      event.target.value = '';
    }
  });
  document.getElementById('reset-button').addEventListener('click', () => {
    confirmAction('Очистить все ответы?', 'Ответы исчезнут из этой тетради в данном браузере. Скачанные файлы останутся у тебя.', () => {
      answers = Object.create(null);
      syncFields();
      persist();
      setFileStatus('Тетрадь очищена. Можно начать заново.');
    }, 'Очистить');
  });
  form.addEventListener('submit', event => event.preventDefault());
  window.addEventListener('pagehide', () => { if (persistTimer) persist(); });
  readSaved();
  render();
  updateProgress();
})();
