export type ServiceCategory = "surgical" | "phlebology" | "cosmetology";

export interface Service {
  id: string;
  slug: string;
  category: ServiceCategory;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export const services: Service[] = [
  // Пластична хірургія (surgical)
  {
    id: "1",
    slug: "blepharoplasty",
    category: "surgical",
    title: "Блефаропластика",
    description:
      "Блефаропластика допомагає повернути погляду свіжість і відпочилий вигляд, м'яко усуваючи вікові зміни та зберігаючи природність рис.",
    image: "/images/image (1).png",
    imageAlt: "Блефаропластика",
  },
  {
    id: "2",
    slug: "facelift",
    category: "surgical",
    title: "Підтяжка обличчя",
    description:
      "Підтяжка обличчя м'яко відновлює чіткість овалу, освіжає зовнішність і допомагає виглядати молодше, зберігаючи природні риси.",
    image: "/images/image.png",
    imageAlt: "Підтяжка обличчя",
  },
  {
    id: "3",
    slug: "liposuction",
    category: "surgical",
    title: "Ліпосакція",
    description:
      "Ліпосакція м'яко коригує проблемні зони, допомагає підкреслити контури тіла та зробити фігуру більш пропорційною й легкою.",
    image: "/images/image (2).png",
    imageAlt: "Ліпосакція",
  },
  {
    id: "4",
    slug: "mammoplasty",
    category: "surgical",
    title: "Мамопластика",
    description:
      "Мамопластика допомагає відновити гармонійну форму грудей, повернути відчуття жіночності та впевненість у власному тілі.",
    image: "/images/image (1).png",
    imageAlt: "Мамопластика",
  },
  {
    id: "5",
    slug: "abdominoplasty",
    category: "surgical",
    title: "Абдомінопластика",
    description:
      "Абдомінопластика допомагає повернути животу пласкість і підтягнутість, відновлює комфорт у тілі та впевненість у собі.",
    image: "/images/image.png",
    imageAlt: "Абдомінопластика",
  },
  {
    id: "6",
    slug: "limbs-lift",
    category: "surgical",
    title: "Підтяжка верхніх і нижніх кінцівок",
    description:
      "Підтяжка рук або стегон допомагає повернути шкірі пружність і охайний вигляд, роблячи контури кінцівок більш чіткими та гармонійними.",
    image: "/images/image (2).png",
    imageAlt: "Підтяжка верхніх і нижніх кінцівок",
  },
  // Флебологія (phlebology)
  {
    id: "7",
    slug: "laser-varicose-treatment",
    category: "phlebology",
    title: "Лікування варикозу лазером",
    description:
      "Лазерне лікування варикозу допомагає позбутися важкості та видимих проявів, повертаючи ногам легкість і комфорт без тривалої реабілітації.",
    image: "/images/image (1).png",
    imageAlt: "Лікування варикозу лазером",
  },
  {
    id: "8",
    slug: "miniphlebectomy",
    category: "phlebology",
    title: "Мініфлебоктомія",
    description:
      "Мініфлебектомія м'яко усуває варикозні вузли, зменшує дискомфорт і повертає ногам акуратний, естетичний вигляд.",
    image: "/images/image.png",
    imageAlt: "Мініфлебоктомія",
  },
  {
    id: "9",
    slug: "sclerotherapy",
    category: "phlebology",
    title: "Склерооблітерація",
    description:
      "Склеротерапія допомагає позбутися судинних сіточок, вирівнює тон шкіри та повертає ногам охайний, доглянутий вигляд.",
    image: "/images/image (2).png",
    imageAlt: "Склерооблітерація",
  },
  // Ін'єкційна косметологія (cosmetology)
  {
    id: "10",
    slug: "botulinum-therapy",
    category: "cosmetology",
    title: "Ботулінотерапія",
    description:
      "Ботулінотерапія м'яко розгладжує мімічні зморшки, зберігаючи живу міміку та надаючи обличчю відпочилий, спокійний вигляд.",
    image: "/images/image (1).png",
    imageAlt: "Ботулінотерапія",
  },
  {
    id: "11",
    slug: "fillers",
    category: "cosmetology",
    title: "Філери",
    description:
      "Філери м'яко відновлюють об'єм і гармонію рис, освіжають обличчя та підкреслюють природну виразність без операції.",
    image: "/images/image.png",
    imageAlt: "Філери",
  },
  {
    id: "12",
    slug: "biostimulating-fillers",
    category: "cosmetology",
    title: "Біостимулюючі філери",
    description:
      "Біостимулюючі філери м'яко запускають вироблення колагену, зміцнюють тканини та забезпечують поступове, природне омолодження.",
    image: "/images/image (2).png",
    imageAlt: "Біостимулюючі філери",
  },
  {
    id: "13",
    slug: "non-hyaluronic-fillers",
    category: "cosmetology",
    title: "Філери на основі негіалуронових сполук",
    description:
      "Філери на основі негіалуронових сполук забезпечують тривалий ефект та природне відновлення об'єму тканин.",
    image: "/images/image (1).png",
    imageAlt: "Філери на основі негіалуронових сполук",
  },
];

export const serviceCategories: { value: ServiceCategory; label: string }[] = [
  { value: "surgical", label: "Пластична хірургія" },
  { value: "phlebology", label: "Флебологія" },
  { value: "cosmetology", label: "Ін'єкційна косметологія" },
];

