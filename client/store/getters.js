// this software package
export const pkg = state => state.pkg
export const app = state => state.app
// what kind of device is viewing this website
export const device = state => state.app.device
export const effect = state => state.app.effect
// loading and working status objects. used for tracking status of REST API operations
export const loading = state => state.loading
export const working = state => state.working
