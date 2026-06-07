const albumPath = `/images/photoAlbums`

const getPhotoUrl = (albumName, numberOfPhotos, ext = 'jpeg') => {
    const photos = Array.from({ length: numberOfPhotos - 1 }, (_, i) => `${albumPath}/${albumName}/${i + 1}.${ext}`)
    const cover = `${albumPath}/${albumName}/cover-${albumName}.${ext}`
    return [cover, ...photos]
}

const getAlbumCoverUrl = (albumName, ext) => `${albumPath}/${albumName}/cover-${albumName}.${ext}`


const albumsData = [

    //   {
    //         newsId: ,
    //         id: ,
    //         title: ,
    //         date: ,
    //         photos: [],
    //     },

    //   {
    //         newsId: ,
    //         id: ,
    //         title: ,
    //         date: ,
    //         photos: [],
    //     },

    //   {
    //         newsId: ,
    //         id: ,
    //         title: ,
    //         date: ,
    //         photos: [],
    //     },

    //   {
    //         newsId: ,
    //         id: ,
    //         title: ,
    //         date: ,
    //         photos: [],
    //     },

    {
        newsId: 70,
        id: 13,
        title: 'Открытый чемпионат по Тхэквондо',
        date: '2014-04-13',
        cover: getAlbumCoverUrl('13.04.14', 'jpeg'),
        photos: getPhotoUrl('13.04.14', 5),
    },

    {
        newsId: 69,
        id: 12,
        title: 'Аттестация спортсменов Ассоциации ',
        date: '2014-03-01',
        cover: getAlbumCoverUrl('01.03.14', 'jpeg'),
        photos: getPhotoUrl('01.03.14', 5),
    },

    {
        newsId: 68,
        id: 11,
        title: 'Фестиваль боевых искусств',
        date: '2014-02-15',
        cover: getAlbumCoverUrl('15.02.14', 'jpeg'),
        photos: getPhotoUrl('15.02.14', 5),
    },

    {
        newsId: 67,
        id: 10,
        title: 'Открытый чемпионат Ассоциации',
        date: '2013-12-22',
        cover: getAlbumCoverUrl('22.12.13', 'jpeg'),
        photos: getPhotoUrl('22.12.13', 5),
    },

    {
        newsId: 66,
        id: 9,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2013-11-30',
        cover: getAlbumCoverUrl('30.11.13', 'jpeg'),
        photos: getPhotoUrl('30.11.13', 5),
    },
    {
        newsId: 65,
        id: 8,
        title: '23 годовщина Ассоциации Му Дук Кван',
        date: '2013-09-15',
        cover: getAlbumCoverUrl('15.09.13', 'jpeg'),
        photos: getPhotoUrl('15.09.13', 5),
    },
    {
        newsId: 64,
        id: 7,
        title: 'Аттестация спортсменов Ассоциации ',
        date: '2013-06-15',
        cover: getAlbumCoverUrl('15.06.13', 'jpeg'),
        photos: getPhotoUrl('15.06.13', 5),
    },
    {
        newsId: 63,
        id: 6,
        title: 'Открытый чемпионат Ассоциации.',
        date: '2013-04-07',
        cover: getAlbumCoverUrl('07.04.13', 'jpeg'),
        photos: getPhotoUrl('07.04.13', 10),
    },


    {
        newsId: 61,
        id: 5,
        title: 'Квалификационная аттестация спортсменов Ассоциации',
        date: '2013-03-02',
        cover: getAlbumCoverUrl('02.03.13', 'jpeg'),
        photos: getPhotoUrl('02.03.13', 5),
    },

    {
        newsId: 60,
        id: 4,
        title: 'Фестиваль боевых искусств "СЫНЫ ОТЕЧЕСТВА"',
        date: '2013-02-17',
        cover: getAlbumCoverUrl('17.02.13', 'jpeg'),
        photos: getPhotoUrl('17.02.13', 5),
    },

    {
        newsId: 58,
        id: 3,
        title: 'Открытый чемпионат г. Краснодара по Тхэквондо',
        date: '2012-12-23',
        cover: getAlbumCoverUrl('23.12.12', 'jpeg'),
        photos: getPhotoUrl('23.12.12', 5),
    },

    {
        newsId: 57,
        id: 2,
        title: 'Квалификационная аттестация спортсменов',
        date: '2012-11-24',
        cover: getAlbumCoverUrl('24.11.12', 'jpeg'),
        photos: getPhotoUrl('24.11.12', 10),
    },

    {
        newsId: 18,
        id: 1,
        title: 'Приезд мастера ПАН МЕН ДО',
        date: '2007-11-24',
        cover: getAlbumCoverUrl('24.11.07', 'jpeg'),
        photos: getPhotoUrl('24.11.07', 25),
    },

]

export default albumsData