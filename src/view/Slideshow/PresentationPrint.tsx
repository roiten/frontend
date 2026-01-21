import {jsPDF} from 'jspdf'
import html2canvas from 'html2canvas'
import SlideRenderer from '../Editor/Slide/SlideRenderer.tsx'
import {type Slide} from '../../store/types.ts'
import {createRoot} from 'react-dom/client'
import {Provider} from 'react-redux'
import {store} from '../../store/store.ts'
import {flushSync} from 'react-dom'
import { SLIDE_HEIGHT, SLIDE_WIDTH } from '../../store/default.ts'

async function exportSlidesToPDF(slides: Slide[], fileName: string) {
    if (slides.length < 1) {
        alert('Презентация пустая. Добавьте первый слайд')
        return
    }
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [SLIDE_WIDTH, SLIDE_HEIGHT],
    })

    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.top = '-10000px'
    container.style.left = '-10000px'
    container.style.width = String(SLIDE_WIDTH)
    container.style.height = String(SLIDE_HEIGHT)
    container.style.backgroundColor = 'white'
    document.body.appendChild(container)

    try {
        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i]

            const root = createRoot(container)
            flushSync(() => {
                root.render(
                    <Provider store={store}>
                        <SlideRenderer
                            slide={slide}
                            mode="slideshow"
                        />
                    </Provider>
                )
            })

            const canvas = await html2canvas(container, {
                width: SLIDE_WIDTH,
                height: SLIDE_HEIGHT,
                scale: 2,
                backgroundColor: null
            })

            const imgData = canvas.toDataURL('image/png')

            if (i > 0) {
                pdf.addPage()
            }
            pdf.addImage(imgData, 'PNG', 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT)

            root.unmount()
        }

        pdf.save(`${fileName}.pdf`)
    } finally {
        document.body.removeChild(container)
    }
}


export {
    exportSlidesToPDF,
}