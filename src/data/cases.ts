export type CaseCategory =
  | "all"
  | "blepharoplasty"
  | "facelift"
  | "liposuction"
  | "mammoplasty";

export interface Case {
  id: string;
  slug: string; // Slug для URL
  categories: CaseCategory[]; // Масив категорій
  image: string;
  imageAlt: string;
  title?: string;
  description: string; // Обов'язковий опис
}

export const cases: Case[] = [
  {
    id: "1",
    slug: "blepharoplasty-case-1",
    categories: ["blepharoplasty"],
    image: "/images/image (1).png",
    imageAlt: "Блефаропластика кейс 1",
    description: "Відновлення молодого вигляду очей з природним результатом",
  },
  {
    id: "2",
    slug: "blepharoplasty-facelift-case-1",
    categories: ["blepharoplasty", "facelift"],
    image: "/images/image.png",
    imageAlt: "Блефаропластика кейс 2",
    description: "Комплексне омолодження обличчя та очей",
  },
  {
    id: "3",
    slug: "facelift-case-1",
    categories: ["facelift"],
    image: "/images/image (2).png",
    imageAlt: "Підтяжка обличчя кейс 1",
    description: "Повернення чітких контурів та підтягнутої шкіри",
  },
  {
    id: "4",
    slug: "facelift-liposuction-case-1",
    categories: ["facelift", "liposuction"],
    image: "/images/image (1).png",
    imageAlt: "Підтяжка обличчя кейс 2",
    description: "Комплексна корекція обличчя та шиї",
  },
  {
    id: "5",
    slug: "liposuction-case-1",
    categories: ["liposuction"],
    image: "/images/image.png",
    imageAlt: "Ліпосакція кейс 1",
    description: "Моделювання фігури з природними контурами",
  },
  {
    id: "6",
    slug: "liposuction-mammoplasty-case-1",
    categories: ["liposuction", "mammoplasty"],
    image: "/images/image (2).png",
    imageAlt: "Ліпосакція кейс 2",
    description: "Комплексне моделювання тіла та грудей",
  },
  {
    id: "7",
    slug: "mammoplasty-case-1",
    categories: ["mammoplasty"],
    image: "/images/image (1).png",
    imageAlt: "Мамопластика кейс 1",
    description: "Збільшення грудей з природним виглядом",
  },
  {
    id: "8",
    slug: "mammoplasty-liposuction-case-1",
    categories: ["mammoplasty", "liposuction"],
    image: "/images/image.png",
    imageAlt: "Мамопластика кейс 2",
    description: "Підтяжка грудей та корекція фігури",
  },
  {
    id: "9",
    slug: "blepharoplasty-case-2",
    categories: ["blepharoplasty"],
    image: "/images/image (2).png",
    imageAlt: "Блефаропластика кейс 3",
    description: "Видалення зайвої шкіри та корекція форми очей",
  },
  {
    id: "10",
    slug: "facelift-case-2",
    categories: ["facelift"],
    image: "/images/image (1).png",
    imageAlt: "Підтяжка обличчя кейс 3",
    description: "Омолодження обличчя з мінімальними рубцями",
  },
  {
    id: "11",
    slug: "blepharoplasty-facelift-case-2",
    categories: ["blepharoplasty", "facelift"],
    image: "/images/image.png",
    imageAlt: "Комплексний кейс 1",
    description: "Повне омолодження верхньої третини обличчя",
  },
  {
    id: "12",
    slug: "liposuction-case-2",
    categories: ["liposuction"],
    image: "/images/image (2).png",
    imageAlt: "Ліпосакція кейс 3",
    description: "Корекція проблемних зон живота та боків",
  },
  {
    id: "13",
    slug: "mammoplasty-case-2",
    categories: ["mammoplasty"],
    image: "/images/image (1).png",
    imageAlt: "Мамопластика кейс 3",
    description: "Зменшення та підтяжка грудей",
  },
  {
    id: "14",
    slug: "facelift-blepharoplasty-case-1",
    categories: ["facelift", "blepharoplasty"],
    image: "/images/image.png",
    imageAlt: "Комплексний кейс 2",
    description: "Омолодження обличчя та очей одночасно",
  },
  {
    id: "15",
    slug: "liposuction-mammoplasty-case-2",
    categories: ["liposuction", "mammoplasty"],
    image: "/images/image (2).png",
    imageAlt: "Комплексний кейс 3",
    description: "Моделювання тіла та корекція грудей",
  },
  {
    id: "16",
    slug: "blepharoplasty-case-3",
    categories: ["blepharoplasty"],
    image: "/images/image (1).png",
    imageAlt: "Блефаропластика кейс 4",
    description: "Корекція навислих повік верхнього та нижнього",
  },
  {
    id: "17",
    slug: "facelift-liposuction-case-2",
    categories: ["facelift", "liposuction"],
    image: "/images/image.png",
    imageAlt: "Комплексний кейс 4",
    description: "Підтяжка обличчя та корекція підборіддя",
  },
  {
    id: "18",
    slug: "mammoplasty-case-3",
    categories: ["mammoplasty"],
    image: "/images/image (2).png",
    imageAlt: "Мамопластика кейс 4",
    description: "Асиметрична корекція та підтяжка грудей",
  },
  {
    id: "19",
    slug: "liposuction-case-3",
    categories: ["liposuction"],
    image: "/images/image (1).png",
    imageAlt: "Ліпосакція кейс 4",
    description: "Моделювання стегон та сідниць",
  },
  {
    id: "20",
    slug: "complex-case-1",
    categories: ["blepharoplasty", "facelift", "liposuction"],
    image: "/images/image.png",
    imageAlt: "Комплексний кейс 5",
    description: "Повне омолодження обличчя та корекція фігури",
  },
];

export const caseCategories: { value: CaseCategory; label: string }[] = [
  { value: "all", label: "Всі" },
  { value: "blepharoplasty", label: "Блефаропластика" },
  { value: "facelift", label: "Підтяжка обличчя" },
  { value: "liposuction", label: "Ліпосакція" },
  { value: "mammoplasty", label: "Мамопластика" },
];
