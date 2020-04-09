import './console.scss';


type ErrorResponse = {
    error: string
}
type SuccessResponse = {
    errors: string,
    output: string,
    status: number
}
type APIResponse = ErrorResponse | SuccessResponse;

const Console = (response: APIResponse) => {
    if (typeof response === "string") {
        return (
            <div className="error">
                {response}
            </div>
        )
    }
    return (
        <div>
            <h3>Successfully compiled</h3>
        </div>
    )
}

export default Console;