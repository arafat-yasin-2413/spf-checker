import { Oval } from "react-loader-spinner";
const Loader = ({ size = 40, color = "#4f46e5" }) => {
    return (
        <div className="flex justify-center items-center py-6">
			<Oval
				height={size}
				width={size}
				color={color}
				secondaryColor="#c7d2fe"
				strokeWidth={4}
				strokeWidthSecondary={4}
				ariaLabel="loading"
				visible={true}
			/>
		</div>
    );
};

export default Loader;