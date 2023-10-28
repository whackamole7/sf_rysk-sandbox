import { Routes, Route, Navigate, useLocation, useNavigate, } from "react-router-dom";
import { HOMEPAGE_HREF } from "../../../environment/constants/commonConstants";
import Terminal from "../../Terminal/Terminal";
import Builder from './../../Terminal/Builder/Builder';
import { useEffect } from "react";
import Sandbox from "../../Sandbox/Sandbox";
import RyskSandbox from "../../RyskSandbox/RyskSandbox";


const AppRouter = () => {
	const location = useLocation();
	const navigate = useNavigate();
	
	useEffect(() => {
		if (location.pathname.endsWith("terminal")) {
			navigate("/terminal/builder");
		}
	}, [location.pathname]);

	return (
		<Routes>
			<Route
				path="/terminal"
				element={
					<Terminal />
				}
			>
				<Route
					path="builder"
					element={
						<Builder />
					}
				/>
				<Route
					path="margin-trading"
					element={
						<div>Margin Trading</div>
					}
				/>
			</Route>

			<Route
				path="/sandbox"
				element={
					<Sandbox />
				}
			/>

			<Route
				path="/rysk-sandbox"
				element={
					<RyskSandbox />
				}
			/>
			
			<Route
				path="*"
				element={<Navigate to={HOMEPAGE_HREF} replace />}
			/>
		</Routes>
	);
};

export default AppRouter;