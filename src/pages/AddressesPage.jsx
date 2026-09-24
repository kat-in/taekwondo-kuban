import Breadcrumbs from '../components/Breadcrumbs'
import GymSection from '../components/GymSection/GymSection'
import SEO from '../components/SEO/SEO'

const AddressesPage = () => {
    return (
        <main className="page__section addresses-page">
            <SEO
                title="Адреса занятий — Тхэквондо Му Дук Кван"
                description="Адреса залов и расписание занятий Краснодарской городской ассоциации тхэквондо Му Дук Кван."
            />
            <Breadcrumbs />
            <h1>Адреса занятий</h1>
            <div className="divider"></div>
            <GymSection />
        </main>
    )
}

export default AddressesPage
