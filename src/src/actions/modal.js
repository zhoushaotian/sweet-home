export const UPDATE_TABLE_LOADING = 'UPDATE_TABLE_LOADING';
export const UPDATE_FORM_LOADING = 'UPDATE_FORM_LOADING';

export function updateTableLoading(data) {
    return {
        type: UPDATE_TABLE_LOADING,
        data
    };
}

export function updateFormLoading(data) {
    return {
        type: UPDATE_FORM_LOADING,
        data
    };
}