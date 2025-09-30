// Презентация
type Presentation = {
  title: string;
  slides: Slide[];
  currentSlide: string | null;
  author: string;
  createdAt: Date;
  editedAt: Date;
};

// Слайд
type Slide = {
  id: string;
  background: Background;
  content: SlideObject[];
};

// задний фон
type Background = Color | Picture;

type Color = {
  type: 'color';
  color: string;
};

type Picture = {
  type: 'picture';
  source: string;
  transparency: number;
};

// Объект слайда
type SlideObject = Text | Image;

// базовый объект слайда
type BaseObject = {
  id: string;
  transparency: number;

  position: {
    x: number;
    y: number;
  };

  size: {
    width: number;
    height: number;
  };
};

// текст
type Text = BaseObject & {
  description: string;
  type: 'text';
  font: {
    family: string;
    color: string;
    size: number;
    weight: number;
    textDecoration: 'strikethrough' | 'underline' | 'none';
    textAlign: 'left' | 'center' | 'right' | 'justify';
  };
};

// изображение
type Image = BaseObject & {
  source: string;
  type: 'image';
};

// выделение
type Selection = {
  selectedSlideId: string[];
  selectedObjectId: string[];
};

// * изменение названия презентации ?
// * добавление/удаление слайда ?
// * изменение позиции слайда
// * добавление/удаление текста и картинки +
// * изменение позиции текста/картинки ?
// * изменение объекта (картинки) +
// * изменение текста +
// * изменение семейства шрифтов у текста +
// * изменение фона слайда +

// Изменение названия презентации
function setPresentationTitle(pres: Presentation, newTitle: string): Presentation {
  return { ...pres, title: newTitle, editedAt: new Date() };
}

// добавление слайда
function addSlide(pres: Presentation, slide: Slide): Presentation {
  const newSlides = [...pres.slides, slide];
  return { ...pres, slides: newSlides, editedAt: new Date() };
}

// Удаление слайда
function removeSlide(pres: Presentation, slideId: string): Presentation {
  const otherSlides = pres.slides.filter((s) => s.id !== slideId);
  return { ...pres, slides: otherSlides, editedAt: new Date() };
}

// Изменение позиции слайда
function moveSlide(pres: Presentation, slideId: string, newIndex: number): Presentation {
  const slides = [...pres.slides];
  const oldIndex = slides.findIndex((s) => s.id === slideId);
  if (oldIndex === -1) return pres;

  const [slide] = slides.splice(oldIndex, 1);
  slides.splice(newIndex, 0, slide);
  return { ...pres, slides, editedAt: new Date() };
}

// Добавление объекта в слайд
function addSlideObject(slide: Slide, obj: SlideObject): Slide {
  return { ...slide, content: [...slide.content, obj] };
}

// Удаление объекта
function removeSlideObject(slide: Slide, objectId: string): Slide {
  return {
    ...slide,
    content: slide.content.filter((obj) => obj.id !== objectId),
  };
}

// Изменение текста или картинки
function editObject(obj: SlideObject, src: string): SlideObject {
  if (obj.type === 'text') {
    return { ...obj, description: src };
  } else if (obj.type === 'image') {
    return { ...obj, source: src };
  }
  return obj;
}

// изменение позиции объекта
function setObjectPositionCoordinates(
  slideObject: SlideObject,
  position: { x: number; y: number },
): SlideObject {
  return {
    ...slideObject,
    position: { ...slideObject.position, ...position },
  } as SlideObject;
}

// изменение размера объекта
function setObjectPositionSize(
  slideObject: SlideObject,
  size: { width: number; height: number },
): SlideObject {
  return {
    ...slideObject,
    position: { ...slideObject.size, width: size.width, height: size.height },
  } as SlideObject;
}

// Изменение размера шрифта для текста
function setTextSize(slide: Slide, textId: string, size: number): Slide {
  const content = slide.content.map((obj) =>
    obj.type === 'text' && obj.id === textId ? { ...obj, font: { ...obj.font, size } } : obj,
  );
  return { ...slide, content };
}

// Изменение семейства шрифта для текста
function setTextFont(slide: Slide, textId: string, family: string): Slide {
  const content = slide.content.map((obj) =>
    obj.type === 'text' && obj.id === textId ? { ...obj, font: { ...obj.font, family } } : obj,
  );
  return { ...slide, content };
}

// изменение текста
function setTextDescription(slide: Slide, textId: string, description: string): Slide {
  const content = slide.content.map((obj) =>
    obj.type === 'text' && obj.id === textId ? { ...obj, description } : obj,
  );
  return { ...slide, content };
}

// Изменение фона слайда
function setSlideBackground(slide: Slide, Background: Background): Slide {
  return { ...slide, background: Background };
}

function chooseSlide(pres: Presentation, slideId: string): Presentation {
    const slideExists = pres.slides.some(slide => slide.id === slideId);
    if (slideExists) {
        return {...pres, currentSlide: slideId };
    }
    return pres;
}

export {
  setPresentationTitle,
  addSlide,
  removeSlide,
  moveSlide,
  addSlideObject,
  removeSlideObject,
  editObject,
  setObjectPositionCoordinates,
  setObjectPositionSize,
  setTextSize,
  setTextFont,
  setTextDescription,
  setSlideBackground,
  chooseSlide,
  Presentation,
  Image,
  Text,
  Slide,
  SlideObject,
  Background,
};
