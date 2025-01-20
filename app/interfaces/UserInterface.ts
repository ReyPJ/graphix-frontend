export interface UserListInterface {
    id: number;
    username: string;
    is_temporary: boolean;
    pdf_progress: number;
    page_limit: number;
    raw_password: string;
    package: string;
}