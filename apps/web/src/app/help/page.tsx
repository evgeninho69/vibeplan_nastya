import { PageHeader } from "@/components/PageHeader";
import { Card, Icon } from "@vibeplan/ui";
import { MOCK_TODAY } from "@vibeplan/db/mock";
import Link from "next/link";

const FAQ = [
  {
    q: "Что такое «анти-выгорание»?",
    a: "Мы намеренно избегаем токсичной продуктивности: красных счётчиков, давления «не упасть на прогнозе». Если энергия сегодня низкая — приложение само предлагает облегчённый план, без чувства вины. Слово «отдых» здесь не наказание, а часть пути.",
  },
  {
    q: "Как Майя знает, что мне сказать?",
    a: "Майя видит: твоё расписание на сегодня, последние N дней, контекстные якоря памяти (которые ты добавляешь сама), уровень энергии. Она выбирает один из 3 пресетов тона: «Бережная подруга» (мягко), «Академический наставник» (чёткие дедлайны) или «Дзен-коуч» (медитативно). Никаких медицинских или финансовых советов — это в её system prompt.",
  },
  {
    q: "Где обрабатывается мой голос?",
    a: "Если браузер поддерживает Web Speech API (Chrome, Edge, Safari на десктопе), распознавание идёт локально — аудио не покидает устройство. Это честно указано в модале диктовки: «Аудио обрабатывается локально на устройстве с заботой о приватности». Серверный fallback (Yandex SpeechKit) подключается только если браузер не поддерживает локальный STT — и только с явным согласием.",
  },
  {
    q: "Что если я отстала от плана?",
    a: "Это нормальная часть подготовки к ЕГЭ. В нижней части плана дня есть «Перенести задачу без чувства вины» — мягко переносит сессию на завтра без удаления. Слово «streak broken» в продукте не используется нигде — мы его осознанно избегаем.",
  },
  {
    q: "Когда появится реальный AI вместо canned-ответов?",
    a: "Сейчас Майя в stub-режиме (видно в чате: «online · stub»). Добавьте OPENROUTER_API_KEY в `.env.local` — и она заговорит по-настоящему через claude-3.5-sonnet. Без правок кода.",
  },
  {
    q: "Как включить Telegram-бот?",
    a: "Получите токен через @BotFather, пропишите TELEGRAM_BOT_TOKEN в env. Бот автоматически стартует. По умолчанию доступ открыт вашему user_id 429471588.",
  },
];

export default function HelpPage() {
  return (
    <>
      <PageHeader date={MOCK_TODAY} title="Помощь 🌿" />
      <div className="px-5 md:px-8 pb-12 max-w-3xl mx-auto flex flex-col gap-5 vp-stagger">
        <Card variant="paper" pad="md">
          <h2 className="font-bold text-[24px] tracking-[-0.015em] mb-2">Как пользоваться ВайбПланом</h2>
          <p className="text-[14px] text-[var(--on-surface-variant)] leading-relaxed">
            Короткий гайд по самым частым сценариям. Если что-то непонятно — спрашивайте Майю прямо в чате (плавающая кнопка справа внизу).
          </p>
        </Card>

        {FAQ.map((item, i) => (
          <Card key={i} variant="paper" pad="md">
            <details>
              <summary className="cursor-pointer font-semibold text-[15px] list-none flex items-center gap-2">
                <Icon name="help" size={18} className="text-[var(--primary-500)]" />
                {item.q}
                <Icon name="expand_more" size={18} className="ml-auto text-[var(--on-surface-variant)]" />
              </summary>
              <p className="mt-3 text-[14px] text-[var(--on-surface-variant)] leading-relaxed">{item.a}</p>
            </details>
          </Card>
        ))}

        <Card variant="paper" pad="md">
          <h3 className="font-semibold text-[18px] mb-3">Сообщество и поддержка</h3>
          <p className="text-[13px] text-[var(--on-surface-variant)] mb-4">
            Если вы нашли баг или хотите предложить идею — напишите в Telegram-бот командой /feedback, либо на почту hello@vibeplan.app.
          </p>
          <Link href="/today" className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[var(--primary-500)] text-[var(--on-primary)] font-semibold text-[13px] vp-press">
            <Icon name="arrow_forward" size={18} /> Открыть Сегодня
          </Link>
        </Card>
      </div>
    </>
  );
}