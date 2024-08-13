import {
    Navbar,
    TickerTape,
    IndexSlider,
    TradingViewLightChart,
    TradingViewAdvanceChart,
    WatchlistComponent,
} from '@/components'
import './homePage.css'

export const HomePage = () => {
    return (
        <>
            <div className="main-content">
                <div>
                    <TickerTape />
                </div>

                <div className="marginTop">
                    <Navbar />
                </div>

                <div>
                    <IndexSlider />
                </div>
                <div>
                    <WatchlistComponent />
                </div>

                <div style={{ height: '500px', width: '79%', margin: 'auto' }}>
                    <TradingViewAdvanceChart />
                </div>

                <div style={{ height: '500px', width: '79%', margin: 'auto' }}>
                    <TradingViewAdvanceChart />
                </div>
            </div>
        </>
    )
}
