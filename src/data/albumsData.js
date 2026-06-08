const albumPath = `/images/photoAlbums`

const getPhotoUrl = (albumName, numberOfPhotos, ext = 'jpeg') => {
    const photos = Array.from({ length: numberOfPhotos }, (_, i) => `${albumPath}/${albumName}/${i + 1}.${ext}`)
    return photos
}

const getAlbumCoverUrl = (albumName, ext = 'jpeg') => `${albumPath}/${albumName}/1.${ext}`


const albumsData = [

       {
        newsId: 94,
        id: 32,
        title: 'Открытый чемпионат г. Краснодара по боевому Тхэквондо',
        date: '2016-12-18',
        photos: getPhotoUrl('18.12.16', 5),
    },


    {
        newsId: 93,
        id: 31,
        title: 'Двадцать шестая годовщина Ассоциации',
        date: '2016-11-26',
        photos: getPhotoUrl('26.11.16', 5),
    },

    {
        newsId: 92,
        id: 30,
        title: 'Двадцать шестая годовщина Ассоциации',
        date: '2016-09-11',
        photos: getPhotoUrl('11.09.16', 5),
    },

    {
        newsId: 91,
        id: 29,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2016-06-11',
        photos: getPhotoUrl('11.06.16', 5),
    },

    {
        newsId: 90,
        id: 28,
        title: 'Открытый чемпионат г. Краснодара по боевому Тхэквондо',
        date: '2016-04-10',
        photos: getPhotoUrl('10.04.16', 5),
    },


    {
        newsId: 89,
        id: 27,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2016-02-27',
        photos: getPhotoUrl('27.02.16', 5),
    },

    {
        newsId: 88,
        id: 26,
        title: 'Фестиваль боевых искусств',
        date: '2016-02-20',
        photos: getPhotoUrl('20.02.16', 10),
    },

    {
        newsId: 87,
        id: 25,
        title: 'Открытый чемпионат г. Краснодара по боевому Тхэквондо',
        date: '2015-12-20',
        photos: getPhotoUrl('20.12.15', 15),
    },

    {
        newsId: 85,
        id: 24,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2015-11-28',
        photos: getPhotoUrl('28.11.15', 5),
    },

    {
        newsId: 82,
        id: 23,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2015-06-13',
        photos: getPhotoUrl('13.06.15', 5),
    },

    {
        newsId: 81,
        id: 22,
        title: 'Открытый чемпионат г. Краснодара по боевому Тхэквондо',
        date: '2015-04-19',
        photos: getPhotoUrl('19.04.15', 5),
    },

    {
        newsId: 80,
        id: 21,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2015-02-28',
        photos: getPhotoUrl('28.02.15', 10),
    },

    {
        newsId: 79,
        id: 20,
        title: '9 фестиваль боевых искусств',
        date: '2015-02-14',
        photos: getPhotoUrl('14.02.15', 10),
    },

    {
        newsId: 77,
        id: 19,
        title: 'Открытый чемпионат по Тхэквондо',
        date: '2014-12-21',
        photos: getPhotoUrl('21.12.14', 5),
    },

    {
        newsId: 76,
        id: 18,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2014-11-29',
        photos: getPhotoUrl('29.11.14', 5),
    },

    {
        newsId: 74,
        id: 17,
        title: '24 годовщина Ассоциации МУ ДУК КВАН',
        date: '2014-09-14',
        photos: getPhotoUrl('14.09.14', 5),
    },

    {
        newsId: 73,
        id: 16,
        title: 'Показательные выступления',
        date: '2014-09-13',
        photos: getPhotoUrl('13.09.14', 5),
    },

    {
        newsId: 72,
        id: 15,
        title: 'День молодежи России',
        date: '2014-06-28',
        photos: getPhotoUrl('28.06.14', 5),
    },

    {
        newsId: 71,
        id: 14,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2014-06-14',
        photos: getPhotoUrl('14.06.14', 5),
    },

    {
        newsId: 70,
        id: 13,
        title: 'Открытый чемпионат по Тхэквондо',
        date: '2014-04-13',
        photos: getPhotoUrl('13.04.14', 5),
    },

    {
        newsId: 69,
        id: 12,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2014-03-01',
        photos: getPhotoUrl('01.03.14', 5),
    },

    {
        newsId: 68,
        id: 11,
        title: 'Фестиваль боевых искусств',
        date: '2014-02-15',
        photos: getPhotoUrl('15.02.14', 5),
    },

    {
        newsId: 67,
        id: 10,
        title: 'Открытый чемпионат Ассоциации',
        date: '2013-12-22',
        photos: getPhotoUrl('22.12.13', 5),
    },

    {
        newsId: 66,
        id: 9,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2013-11-30',
        photos: getPhotoUrl('30.11.13', 5),
    },
    {
        newsId: 65,
        id: 8,
        title: '23 годовщина Ассоциации Му Дук Кван',
        date: '2013-09-15',
        photos: getPhotoUrl('15.09.13', 5),
    },
    {
        newsId: 64,
        id: 7,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2013-06-15',
        photos: getPhotoUrl('15.06.13', 5),
    },
    {
        newsId: 63,
        id: 6,
        title: 'Открытый чемпионат Ассоциации',
        date: '2013-04-07',
        photos: getPhotoUrl('07.04.13', 10),
    },


    {
        newsId: 61,
        id: 5,
        title: 'Квалификационная аттестация спортсменов Ассоциации',
        date: '2013-03-02',
        photos: getPhotoUrl('02.03.13', 5),
    },

    {
        newsId: 60,
        id: 4,
        title: 'Фестиваль боевых искусств "СЫНЫ ОТЕЧЕСТВА"',
        date: '2013-02-17',
        photos: getPhotoUrl('17.02.13', 5),
    },

    {
        newsId: 58,
        id: 3,
        title: 'Открытый чемпионат г. Краснодара по Тхэквондо',
        date: '2012-12-23',
        photos: getPhotoUrl('23.12.12', 5),
    },

    {
        newsId: 57,
        id: 2,
        title: 'Квалификационная аттестация спортсменов',
        date: '2012-11-24',
        photos: getPhotoUrl('24.11.12', 10),
    },

    {
        newsId: 18,
        id: 1,
        title: 'Приезд мастера ПАН МЕН ДО',
        date: '2007-11-24',
        photos: getPhotoUrl('24.11.07', 25),
    },

]

export default albumsData