import { useState} from "react"
import Button from "./Button"


const Tabs = ({ tabsData }) => {
    const [activeTab, setActiveTab] = useState(0)

    const handleTabClick = (e) => {
        setActiveTab(Number(e.target.id))
    }

    const dataHeaders = tabsData.map((tab, index) => <button key={index} id={index} className={`${activeTab === index ? 'active__tab' : ''} tab__headers`} onClick={handleTabClick}>{tab.tabName}</button>)
    const {tabContent} = tabsData[activeTab]


    return (
        <div className="tab__container">
            <div className="tab__headers">{dataHeaders}</div>
            <div className="tab__content">{tabContent}</div>
        </div>
    )

}

export default Tabs