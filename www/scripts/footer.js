var SkeletonFooter = React.createClass({
	render: function(){
		return(
			<div className="skeletonFooter">
					<p>© 2015 Julius Rajala</p>
			</div>
		);
	}
});

ReactDOM.render(
		<SkeletonFooter/>,
		document.getElementById('footerPart')
);