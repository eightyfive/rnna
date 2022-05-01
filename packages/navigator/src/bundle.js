"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigatorBundle = void 0;
const react_1 = __importDefault(require("react"));
const react_native_navigation_1 = require("react-native-navigation");
const react_redux_1 = require("react-redux");
const rnna_1 = require("rnna");
const index_1 = require("./index");
class NavigatorBundle extends rnna_1.Bundle {
    register(container) {
        container.constant('navigator', this.options.routes);
        if (this.options.SplashScreen) {
            const splash = (0, index_1.createComponent)('Splash');
            (0, index_1.registerScreen)(splash.name, this.options.SplashScreen);
            react_native_navigation_1.Navigation.events().registerAppLaunchedListener(() => {
                splash.mount();
            });
        }
    }
    boot(services, store) {
        services.navigator;
        (0, index_1.registerRoutes)(screens, createProvider(store, this.options.Provider));
    }
}
exports.NavigatorBundle = NavigatorBundle;
function createProvider(store, Provider) {
    const AppProvider = ({ children }) => {
        const content = Provider ? react_1.default.createElement(Provider, null, children) : children;
        return react_1.default.createElement(react_redux_1.Provider, { store: store }, content);
    };
    return AppProvider;
}
