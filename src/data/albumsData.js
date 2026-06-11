const albumPath = `/images/photoAlbums`

const getPhotoUrl = (albumName, numberOfPhotos, ext = 'jpeg') => {
    const photos = Array.from({ length: numberOfPhotos }, (_, i) => `${albumPath}/${albumName}/${i + 1}.${ext}`)
    return photos
}

const getAlbumCoverUrl = (albumName, ext = 'jpeg') => `${albumPath}/${albumName}/1.${ext}`


const albumsData = [

     {
        newsId: 176,
        id: 88,
        title: 'Чемпионат г. Краснодара по Тхэквондо',
        date: '2026-05-17',
        photos: getPhotoUrl('17.05.26', 5),
    },


      {
        newsId: 175,
        id: 87,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2026-04-26',
        photos: getPhotoUrl('26.04.26', 6),
    },

       {
        newsId: 174,
        id: 86,
        title: 'Чемпионат г. Краснодара по Тхэквондо',
        date: '2026-03-15',
        photos: getPhotoUrl('15.03.26', 10),
    },

     {
        newsId: 173,
        id: 85,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2026-01-26',
        photos: getPhotoUrl('25.01.26', 5),
    },

       {
        newsId: 172,
        id: 84,
        title: 'Помощь госпиталю ветеранов для наших бойцов СВО',
        date: '2026-01-22',
        photos: getPhotoUrl('22.01.26', 3),
    },

       {
        newsId: 171,
        id: 83,
        title: 'Чемпионат г. Краснодара по Тхэквондо',
        date: '2025-12-14',
        photos: getPhotoUrl('14.12.25', 5),
    },

      {
        newsId: 170,
        id: 82,
        title: 'Экскурсия в ОМОН ГУ Росгвардии',
        date: '2025-11-27',
        photos: getPhotoUrl('27.11.25', 5),
    },

      {
        newsId: 169,
        id: 81,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2025-10-26',
        photos: getPhotoUrl('26.10.25', 5),
    },

    {
        newsId: 168,
        id: 80,
        title: 'Благодарственное письмо от депутатов ЗСК',
        date: '2025-10-10',
        photos: getPhotoUrl('10.10.25', 2),
    },

    {
        newsId: 163,
        id: 79,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2025-04-27',
        photos: getPhotoUrl('27.04.25', 5),
    },
    {
        newsId: 162,
        id: 78,
        title: 'Чемпионат г. Краснодара по Тхэквондо',
        date: '2025-03-16',
        photos: getPhotoUrl('16.03.25', 5),
    },

    {
        newsId: 161,
        id: 77,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2025-01-26',
        photos: getPhotoUrl('26.01.25', 5),
    },

    {
        newsId: 160,
        id: 76,
        title: 'Чемпионат Ассоциации',
        date: '2024-12-15',
        photos: getPhotoUrl('15.12.24', 10),
    },

    {
        newsId: 159,
        id: 75,
        title: 'Экскурсия в ОМОН ГУ Росгвардии',
        date: '2024-11-22',
        photos: getPhotoUrl('22.11.24', 5),
    },

    {
        newsId: 156,
        id: 74,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2024-06-30',
        photos: getPhotoUrl('30.06.24', 5),
    },

    {
        newsId: 155,
        id: 73,
        title: 'Чемпионат г. Краснодара по Тхэквондо',
        date: '2024-05-19',
        photos: getPhotoUrl('19.05.24', 5),
    },

    {
        newsId: 151,
        id: 72,
        title: 'Квалификационная аттестация спортсменов',
        date: '2024-02-25',
        photos: getPhotoUrl('25.02.24', 5),
    },

    {
        newsId: 149,
        id: 71,
        title: 'Экскурсия в ОМОН ГУ Росгвардии',
        date: '2023-11-26',
        photos: getPhotoUrl('26.11.23', 5),
    },

    {
        newsId: 148,
        id: 70,
        title: 'Экскурсия в ОМОН ГУ Росгвардии',
        date: '2023-11-25',
        photos: getPhotoUrl('25.11.23', 9),
    },

    {
        newsId: 145,
        id: 69,
        title: 'Аттестация спортсменов Ассоциации ',
        date: '2023-06-18',
        photos: getPhotoUrl('18.06.23', 5),
    },
    {
        newsId: 144,
        id: 68,
        title: 'Чемпионат г. Краснодара по Тхэквондо',
        date: '2023-04-09',
        photos: getPhotoUrl('09.04.23', 5),
    },

    {
        newsId: 143,
        id: 67,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2023-02-26',
        photos: getPhotoUrl('26.02.23', 5),
    },

    {
        newsId: 142,
        id: 66,
        title: 'Чемпионат г. Краснодара по Тхэквондо',
        date: '2022-12-18',
        photos: getPhotoUrl('18.12.22', 5),
    },

    {
        newsId: 141,
        id: 65,
        title: 'Благотворительная акция «лучший друг»',
        date: '2022-11-30',
        photos: getPhotoUrl('30.11.22', 3),
    },


    {
        newsId: 140,
        id: 64,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2022-11-27',
        photos: getPhotoUrl('27.11.22', 5),
    },

    {
        newsId: 139,
        id: 63,
        title: 'Чемпионат г. Краснодара по Тхэквондо',
        date: '2022-10-30',
        photos: getPhotoUrl('30.10.22', 5),
    },

    {
        newsId: 137,
        id: 62,
        title: 'Аттестация на черный пояс Плахова А. Д.',
        date: '2022-07-31',
        photos: getPhotoUrl('31.07.22', 5),
    },

    {
        newsId: 136,
        id: 61,
        title: 'Аттестация спортсменов Ассоциации ',
        date: '2022-06-19',
        photos: getPhotoUrl('19.06.22', 5),
    },

    {
        newsId: 135,
        id: 60,
        title: 'Городское заседание ЕР',
        date: '2022-05-18',
        photos: getPhotoUrl('18.05.22', 1),
    },

    {
        newsId: 134,
        id: 59,
        title: 'Открытый чемпионат Ассоциации',
        date: '2022-04-10',
        photos: getPhotoUrl('10.04.22', 5),
    },

    {
        newsId: 134,
        id: 58,
        title: 'Открытый чемпионат Ассоциации',
        date: '2022-04-10',
        photos: getPhotoUrl('10.04.22', 5),
    },
    {
        newsId: 133,
        id: 57,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2022-02-27',
        photos: getPhotoUrl('27.02.22', 5),
    },

    {
        newsId: 133,
        id: 56,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2022-02-27',
        photos: getPhotoUrl('27.02.22', 5),
    },

    {
        newsId: 131,
        id: 55,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2021-11-28',
        photos: getPhotoUrl('28.11.21', 5),
    },
    {
        newsId: 130,
        id: 54,
        title: 'Открытый чемпионат г. Краснодара по Тхэквондо.',
        date: '2021-10-24',
        photos: getPhotoUrl('24.10.21', 5),
    },

    {
        newsId: 129,
        id: 53,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2021-06-19',
        photos: getPhotoUrl('19.06.21', 5),
    },

    {
        newsId: 116,
        id: 52,
        title: 'Двадцать девятая годовщина Ассоциации',
        date: '2019-09-15',
        photos: getPhotoUrl('15.09.19', 5),
    },


    {
        newsId: 115,
        id: 51,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2019-06-22',
        photos: getPhotoUrl('22.06.19', 5),
    },

    {
        newsId: 114,
        id: 50,
        title: 'Открытый чемпионат г. Краснодара по Тхэквондо',
        date: '2019-04-14',
        photos: getPhotoUrl('14.04.19', 5),
    },

    {
        newsId: 113,
        id: 49,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2019-03-02',
        photos: getPhotoUrl('02.03.19', 5),
    },

    {
        newsId: 112,
        id: 48,
        title: 'Фестиваль боевых искусств',
        date: '2019-02-09',
        photos: getPhotoUrl('09.02.19', 5),
    },

    {
        newsId: 111,
        id: 47,
        title: 'Открытый чемпионат г. Краснодара по боевому Тхэквондо',
        date: '2018-12-16',
        photos: getPhotoUrl('16.12.18', 10),
    },


    {
        newsId: 110,
        id: 46,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2018-11-24',
        photos: getPhotoUrl('24.11.18', 5),
    },

    {
        newsId: 109,
        id: 45,
        title: 'Двадцать восьмая годовщина Ассоциации',
        date: '2018-09-16',
        photos: getPhotoUrl('16.09.18', 5),
    },


    {
        newsId: 108,
        id: 44,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2018-06-16',
        photos: getPhotoUrl('16.06.18', 5),
    },

    {
        newsId: 106,
        id: 43,
        title: 'Открытый чемпионат г. Краснодара по боевому Тхэквондо',
        date: '2018-04-22',
        photos: getPhotoUrl('22.04.18', 10),
    },

    {
        newsId: 105,
        id: 42,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2018-02-24',
        photos: getPhotoUrl('24.02.18', 5),
    },

    {
        newsId: 104,
        id: 41,
        title: 'Фестиваль боевых искусств',
        date: '2018-02-11',
        photos: getPhotoUrl('11.02.18', 5),
    },

    {
        newsId: 103,
        id: 40,
        title: 'Открытый чемпионат г. Краснодара по боевому Тхэквондо',
        date: '2017-12-17',
        photos: getPhotoUrl('17.12.17', 5),
    },

    {
        newsId: 102,
        id: 39,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2017-11-25',
        photos: getPhotoUrl('25.11.17', 8),
    },

    {
        newsId: 101,
        id: 38,
        title: 'Экскурсия в ОМОН ГУВД Краснодарского края',
        date: '2017-11-22',
        photos: getPhotoUrl('22.11.17', 8),
    },

    {
        newsId: 100,
        id: 37,
        title: 'Двадцать седьмая годовщина Ассоциации',
        date: '2017-09-17',
        photos: getPhotoUrl('17.09.17', 5),
    },

    {
        newsId: 99,
        id: 36,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2017-06-17',
        photos: getPhotoUrl('17.06.17', 5),
    },

    {
        newsId: 97,
        id: 35,
        title: 'Открытый чемпионат Ассоциации',
        date: '2017-04-09',
        photos: getPhotoUrl('09.04.17', 5),
    },

    {
        newsId: 96,
        id: 34,
        title: 'Аттестация спортсменов Ассоциации',
        date: '2017-02-25',
        photos: getPhotoUrl('25.02.17', 5),
    },

    {
        newsId: 95,
        id: 33,
        title: 'Фестиваль боевых искусств',
        date: '2017-02-18',
        photos: getPhotoUrl('18.02.17', 5),
    },

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