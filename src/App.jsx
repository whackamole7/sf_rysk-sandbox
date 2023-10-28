import { HashRouter } from 'react-router-dom';
import Header from './pages/App/Header/Header';
import './style/globals.scss';
// todo: ErrorBoundary
// import { ErrorBoundary } from 'react-error-boundary';
import { WagmiConfig, useNetwork } from 'wagmi';
import { getWagmiConfig } from './network/networkUtils';
import Toasts from './components/UI/Toasts/Toasts';
import UnsupportedChainErrorModal from './components/common/ErorrModals/UnsupportedChainErrorModal/UnsupportedChainErrorModal';
import GodEyeConfig from './components/configs/GodEyeConfig';
import AppRouter from './pages/App/AppRouter/AppRouter';
import Tooltips from './components/configs/Tooltips';
// todo: ErrorBoundary
// import GlobalErrorModal from './components/common/ErorrModals/GlobalErrorModal/GlobalErrorModal';
import Footer from './pages/App/Footer/Footer';
import GlobalStickyMessage from './components/common/GlobalStickyMessage/GlobalStickyMessage';


function AppContent() {
	const { chain } = useNetwork();
	
	const renderContent = () => {
		return (
			<>
				<Header />
				<main className='_container'>
					<AppRouter />
				</main>
				<Footer />

				<GlobalStickyMessage>
					Sharwa.Finance is in alpha. Use at your own risk
				</GlobalStickyMessage>
			</>
		)
	}
	const renderUnsupportedChainError = () => {
		return (
			<UnsupportedChainErrorModal
				chainId={chain.id}
			/>
		)
	}

	return chain?.unsupported
		? renderUnsupportedChainError()
		: renderContent();
}



function App() {
	
	return (
		// <ErrorBoundary fallbackRender={GlobalErrorModal} /* todo: ErrorBoundary */>
		<>
			<Toasts />
			<Tooltips />
			<WagmiConfig config={getWagmiConfig()}>
				<HashRouter>
					<GodEyeConfig>

						<AppContent />

					</GodEyeConfig>
				</HashRouter>
			</WagmiConfig>
		</>
		// </ErrorBoundary>
	)
}

export default App;