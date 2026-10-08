// src/components/FeedbackForm.jsx
import { useState } from "react";
import "./FeedbackForm.css";

// Максимальная длина сообщения (задание 1)
const MESSAGE_MAX = 500;

// Маска телефона (задание 2): оставляем только цифры и расставляем
// скобки, пробелы и дефисы по шаблону +7 (XXX) XXX-XX-XX.
// Разделитель добавляется только перед следующей цифрой — иначе при
// удалении клавишей Backspace маска тут же возвращала бы стёртый символ.
function formatPhone(raw) {
  let digits = raw.replace(/\D/g, "");
  // Первая 7 или 8 — это код страны, он уже есть в маске (+7)
  if (digits.startsWith("7") || digits.startsWith("8")) {
    digits = digits.slice(1);
  }
  digits = digits.slice(0, 10);
  if (digits.length === 0) return "";

  let result = "+7 (" + digits.slice(0, 3);
  if (digits.length > 3) result += ") " + digits.slice(3, 6);
  if (digits.length > 6) result += "-" + digits.slice(6, 8);
  if (digits.length > 8) result += "-" + digits.slice(8, 10);
  return result;
}

function FeedbackForm() {
  // --- Состояние значений полей ---
  // Каждый инпут — управляемый компонент: его значение хранится в state.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  // Переключатель «Хочу получить ответ» (задание 3): если включён,
  // Email обязателен. По умолчанию включён — как в исходной форме.
  const [wantReply, setWantReply] = useState(true);

  // --- Состояние ошибки валидации ---
  // Храним текст ошибки для каждого поля отдельно.
  // Если ошибки нет — значение null.
  const [errors, setErrors] = useState({
    name: null,
    email: null,
    phone: null,
    message: null,
  });

  // --- Состояние «тронутых» полей ---
  // Поле считается «тронутым» (touched), если пользователь хотя бы раз
  // вышел из него (blur). До этого момента не показываем ошибки,
  // даже если значение невалидно — это снижает раздражение пользователя.
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    message: false,
  });

  // --- Состояние процесса отправки ---
  // Пока идёт «запрос» — блокируем кнопку и показываем индикатор.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Состояние успешной отправки ---
  // После успешной отправки показываем сообщение вместо формы.
  const [submitted, setSubmitted] = useState(false);

  // Все значения полей одним объектом — чтобы брать значение по имени поля
  const values = { name, email, phone, message };

  // --- Функции валидации ---
  // Имя: минимум 2 символа, только буквы, пробелы и дефис.
  const validateName = (value) => {
    if (!value.trim()) return "Имя обязательно для заполнения";
    if (value.trim().length < 2) return "Минимум 2 символа";
    if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value.trim()))
      return "Только буквы, пробелы и дефис";
    return null; // нет ошибки
  };

  // Email: проверка через регулярное выражение.
  // Правило зависит от переключателя: если ответ не нужен, поле можно
  // оставить пустым (но если что-то введено — формат всё равно проверяем).
  const validateEmail = (value, required = wantReply) => {
    if (!value.trim()) return required ? "Email обязателен для заполнения" : null;
    // Простая, но достаточно надёжная проверка формата.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
      return "Некорректный формат email";
    return null;
  };

  // Телефон: необязательный, но если введён — должен быть заполнен целиком.
  const validatePhone = (value) => {
    if (!value) return null;
    if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value))
      return "Формат: +7 (XXX) XXX-XX-XX";
    return null;
  };

  // Сообщение: минимум 10 и максимум 500 символов.
  const validateMessage = (value) => {
    if (!value.trim()) return "Сообщение обязательно для заполнения";
    if (value.trim().length < 10) return "Минимум 10 символов";
    if (value.length > MESSAGE_MAX) return `Максимум ${MESSAGE_MAX} символов`;
    return null;
  };

  // Универсальный объект валидаторов — удобно перебирать в цикле.
  const validators = {
    name: validateName,
    email: (value) => validateEmail(value),
    phone: validatePhone,
    message: validateMessage,
  };

  // Обработчик изменения поля.
  // Принимает имя поля и новое значение, проверяет и обновляет состояние.
  const handleChange = (field, rawValue) => {
    // Для телефона сначала применяем маску
    const value = field === "phone" ? formatPhone(rawValue) : rawValue;

    // Обновляем значение соответствующего поля через switch.
    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "message":
        setMessage(value);
        break;
      // no default
    }

    // Если поле уже тронуто — сразу валидируем при наборе.
    // Если нет — не показываем ошибки, пока пользователь не уйдёт из поля.
    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validators[field](value),
      }));
    }
  };

  // Обработчик потери фокуса.
  const handleBlur = (field) => {
    // Помечаем поле как тронутое.
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Валидируем текущее значение и записываем результат.
    setErrors((prev) => ({
      ...prev,
      [field]: validators[field](values[field]),
    }));
  };

  // Переключатель «Хочу получить ответ»: правила для Email меняются
  // на лету, поэтому сразу пересчитываем ошибку (если поле уже тронуто).
  // Новое значение переключателя передаём явно: состояние обновится
  // только к следующему рендеру.
  const handleWantReplyChange = (e) => {
    const checked = e.target.checked;
    setWantReply(checked);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(email, checked) }));
    }
  };

  // Обработчик отправки формы.
  const handleSubmit = (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы.

    // 1. Валидируем все поля сразу.
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
      message: validateMessage(message),
    };

    // 2. Записываем ошибки и помечаем все поля как тронутые.
    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, message: true });

    // 3. Если хотя бы одна ошибка есть — не отправляем.
    if (Object.values(newErrors).some((err) => err !== null)) {
      return; // Прерываем отправку.
    }

    // 4. Имитируем отправку на сервер.
    setIsSubmitting(true);

    // setTimeout имитирует сетевой запрос с задержкой 1.5 секунды.
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // В реальном проекте здесь был бы fetch / axios:
      // fetch("/api/feedback", { method: "POST", body: ... })
    }, 1500);
  };

  // Возвращает строку классов для инпута в зависимости от состояния.
  const getInputClass = (field) => {
    // Базовый класс
    const classes = ["field__input"];

    // Если поле тронуто и есть ошибка — добавляем класс ошибки.
    if (touched[field] && errors[field]) {
      classes.push("field__input--error");
    }
    // Если поле тронуто, ошибки нет и в поле что-то введено —
    // добавляем класс успеха. Пустое необязательное поле «успехом» не красим.
    else if (touched[field] && !errors[field] && values[field].trim()) {
      classes.push("field__input--valid");
    }

    // Для textarea добавляем отдельный класс.
    if (field === "message") {
      classes.push("field__input--textarea");
    }

    return classes.join(" ");
  };

  // Если форма успешно отправлена — показываем благодарность.
  if (submitted) {
    return (
      <div className="feedback-form feedback-form--success">
        <h2 className="feedback-form__title">Спасибо за обращение!</h2>
        <p className="feedback-form__text">
          Мы свяжемся с вами в ближайшее время.
        </p>
        <button
          type="button"
          className="feedback-form__submit"
          onClick={() => {
            // Сбрасываем форму к начальному состоянию.
            setName("");
            setEmail("");
            setPhone("");
            setMessage("");
            setWantReply(true);
            setErrors({ name: null, email: null, phone: null, message: null });
            setTouched({ name: false, email: false, phone: false, message: false });
            setSubmitted(false);
          }}
        >
          Отправить ещё одно сообщение
        </button>
      </div>
    );
  }

  return (
    // noValidate отключает встроенную проверку браузера (type="email"),
    // чтобы все сообщения об ошибках выдавала наша валидация.
    <form className="feedback-form" onSubmit={handleSubmit} noValidate>
      {/* Поле «Имя» */}
      <div className="field">
        <label htmlFor="name" className="field__label">
          Имя
        </label>
        <input
          id="name"
          type="text"
          className={getInputClass("name")}
          value={name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
        />
        {/* Блок ошибки появляется только если поле тронуто И есть ошибка */}
        {touched.name && errors.name && (
          <span className="field__error">{errors.name}</span>
        )}
      </div>

      {/* Переключатель «Хочу получить ответ» (задание 3) */}
      <div className="field field--checkbox">
        <input
          id="wantReply"
          type="checkbox"
          checked={wantReply}
          onChange={handleWantReplyChange}
        />
        <label htmlFor="wantReply" className="field__label">
          Хочу получить ответ
        </label>
      </div>

      {/* Поле «Email» */}
      <div className="field">
        <label htmlFor="email" className="field__label">
          Email{wantReply ? "" : " (необязательно)"}
        </label>
        <input
          id="email"
          type="email"
          className={getInputClass("email")}
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
        />
        {touched.email && errors.email && (
          <span className="field__error">{errors.email}</span>
        )}
      </div>

      {/* Поле «Телефон» с маской ввода (задание 2) */}
      <div className="field">
        <label htmlFor="phone" className="field__label">
          Телефон (необязательно)
        </label>
        <input
          id="phone"
          type="tel"
          className={getInputClass("phone")}
          value={phone}
          placeholder="+7 (999) 123-45-67"
          onChange={(e) => handleChange("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
        />
        {touched.phone && errors.phone && (
          <span className="field__error">{errors.phone}</span>
        )}
      </div>

      {/* Поле «Сообщение» со счётчиком символов (задание 1) */}
      <div className="field">
        <label htmlFor="message" className="field__label">
          Сообщение
        </label>
        <textarea
          id="message"
          className={getInputClass("message")}
          value={message}
          maxLength={MESSAGE_MAX}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          rows={5}
        />
        <div className="field__footer">
          <span className="field__error">
            {touched.message && errors.message}
          </span>
          {/* Длину считаем прямо из message.length — отдельное состояние не нужно */}
          <span
            className={
              "field__counter" +
              (message.length >= MESSAGE_MAX ? " field__counter--limit" : "")
            }
          >
            {message.length} / {MESSAGE_MAX}
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="feedback-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Отправка…" : "Отправить"}
      </button>
    </form>
  );
}

export default FeedbackForm;
