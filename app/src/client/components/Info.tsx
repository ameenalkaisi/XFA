import * as React from "react";

const Info: React.FC<{}> = (): React.ReactElement => {
	return (
		<div className="info">
			<h1>Instructions...</h1>
			<p>The syntax looks like this:</p>
			<p>EXPRESSION ::= NODE DASH GREATER_THAN LBRACKET WORD RBRACKET NODE_LIST</p>
			<p>NODE_LIST ::= NODE NODE_LIST | &lt; nothing &gt;</p>
			<p>NODE ::= WORD | WORD LBRACKET NODE_TYPE RRACKET</p>
			<p>NODE_TYPE ::= s | f | sf | fs </p>
			<p>WORD ::= [a-zA-Z0-9_]+</p>

			<h1><a href="https://www.geeksforgeeks.org/introduction-of-finite-automata/">What are NFAs or DFAs?</a></h1>
		</div>
	);
}

export default Info;
