import * as React from "react";

const Footer: React.FC<{}> = (): React.ReactElement => {
	return (
		<footer className="bg-primary text-center text-lg-start">
			<p className="text-center">&copy; 2022 Ameen Al-Kaisi. All rights reserved.</p>
			<p className="text-center">
				<small className="muted">This site is a WIP</small>
			</p>
		</footer>
	);
}

export default Footer;
