import { defineStore } from 'pinia'

export const useCardStore = defineStore('cardContent', {
    state: ()=> ({ 
        cardData: {
            id: '',
            title: '',
            img: '',
            factory: '',
            createTime: '',
            banner: '',
            about: '',
            startLink: '',
            src: '',
            tags: [''],
            title_cn: '',
            _id: '',
        },
    }),
    getters: {
        nowCardData: (state) => {
            if(state.cardData && state.cardData.id) {
                return state.cardData
            }
            const cardData: QuickLinkDataItem = JSON.parse(localStorage.getItem('cardData') || '{}')
            return cardData
        }
    },
    actions: {
        setCardData(data: QuickLinkDataItem) {
            this.cardData = Object.assign({},data)
            localStorage.setItem('cardData', JSON.stringify(data))
        },
        setAbout(about: string) {
            this.cardData = Object.assign({}, this.cardData, {about: about})
            localStorage.setItem('cardData', JSON.stringify(this.cardData))
        }
    }
})

export const useOptionStore = defineStore('OptionStore', {
    state: ()=> ({ 
        sortType: 'default',
        classType: 'tb_list',
        keywords: '',
    }),
})