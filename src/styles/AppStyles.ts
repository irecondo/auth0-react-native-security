import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    profileContainer: {
        flex: 1,
        padding: 20,
        paddingTop: 60
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333333'
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20
    },
    claimsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20
    },
    claimRow: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 10
    },
    claimKey: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 5
    },
    claimValue: {
        fontSize: 14,
        color: '#666666'
    },
    buttonContainer: {
        marginTop: 10
    },
    statusText: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 30
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        width: '80%'
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#CCCCCC'
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#999999',
        fontSize: 14
    },
    universalLoginButton: {
        backgroundColor: '#0066CC',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8
    },
    universalLoginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    },
    otpButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8
    },
    otpButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    },
    passwordlessContainer: {
        width: '85%',
        alignItems: 'center'
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 20
    },
    emailDisplay: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 15
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        marginBottom: 15
    },
    loader: {
        marginVertical: 20
    },
    primaryButton: {
        backgroundColor: '#0066CC',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center'
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    },
    secondaryButton: {
        marginTop: 15,
        paddingVertical: 10
    },
    secondaryButtonText: {
        color: '#0066CC',
        fontSize: 14,
        fontWeight: '500'
    },
    backButton: {
        marginTop: 30,
        paddingVertical: 10
    },
    backButtonText: {
        color: '#666666',
        fontSize: 16
    },
    // Lock Screen styles
    lockScreenContainer: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    lockScreenContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    lockScreenAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#E0E0E0',
    },
    lockScreenGreeting: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 40,
    },
    pinDotsContainer: {
        flexDirection: 'row',
        marginBottom: 40,
    },
    pinDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 8,
    },
    pinDotFilled: {
        backgroundColor: '#0066CC',
    },
    pinPadContainer: {
        marginTop: 20,
    },
    pinPadRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
    },
    pinPadButton: {
        width: 75,
        height: 75,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
    },
    pinPadButtonEmpty: {
        width: 75,
        height: 75,
        marginHorizontal: 15,
    },
    pinPadText: {
        fontSize: 32,
        fontWeight: '300',
        color: '#333333',
    },
    pinPadDeleteText: {
        fontSize: 24,
        color: '#666666',
    },
    pinPadBioText: {
        fontSize: 28,
    },
    forgotPinButton: {
        marginTop: 30,
        paddingVertical: 10,
    },
    forgotPinText: {
        fontSize: 16,
        color: '#0066CC',
    },
    // Onboarding styles
    onboardingContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    onboardingContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    onboardingIcon: {
        fontSize: 80,
        marginBottom: 30,
    },
    onboardingTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 15,
        textAlign: 'center',
    },
    onboardingSubtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    onboardingNote: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'center',
        marginBottom: 30,
    },
    onboardingPrimaryButton: {
        backgroundColor: '#0066CC',
        paddingVertical: 16,
        paddingHorizontal: 50,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    onboardingPrimaryButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    onboardingSecondaryButton: {
        paddingVertical: 12,
    },
    onboardingSecondaryButtonText: {
        color: '#0066CC',
        fontSize: 16,
        fontWeight: '500',
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 10,
        marginLeft: 4,
        alignSelf: 'flex-start'
    },
    pinSetupTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
        textAlign: 'center',
    },
    pinSetupSubtitle: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 40,
        textAlign: 'center',
    },
    // Home Screen styles
    homeContainer: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    homeContent: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    homeAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#E0E0E0',
    },
    homeEmail: {
        fontSize: 18,
        color: '#333333',
        marginBottom: 40,
    },
    homeButtonsContainer: {
        width: '100%',
        marginBottom: 40,
    },
    homeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    homeButtonIcon: {
        fontSize: 24,
        marginRight: 15,
    },
    homeButtonText: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        fontWeight: '500',
    },
    homeButtonArrow: {
        fontSize: 24,
        color: '#CCCCCC',
    },
    logoutButton: {
        paddingVertical: 12,
    },
    logoutButtonText: {
        fontSize: 16,
        color: '#FF3B30',
        fontWeight: '500',
    },
    // Back button for screens
    backButtonHeader: {
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    backButtonHeaderText: {
        fontSize: 16,
        color: '#0066CC',
    },
    // Security Options styles
    securityOptionsContainer: {
        width: '100%',
    },
    securityOption: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    securityOptionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    securityOptionIcon: {
        fontSize: 28,
        marginRight: 15,
    },
    securityOptionText: {
        flex: 1,
    },
    securityOptionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    securityOptionStatus: {
        fontSize: 14,
        color: '#666666',
    },
    autoLockOptionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        marginTop: -6,
        marginBottom: 12,
    },
    autoLockOption: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
    autoLockOptionSelected: {
        borderColor: '#0066CC',
        backgroundColor: '#E8F2FF',
    },
    autoLockOptionText: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '500',
    },
    autoLockOptionTextSelected: {
        color: '#0066CC',
    },
    // Checkbox styles
    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: '#CCCCCC',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    checkboxChecked: {
        backgroundColor: '#0066CC',
        borderColor: '#0066CC',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Change PIN back button
    changePinBackButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    changePinBackButtonText: {
        fontSize: 16,
        color: '#0066CC',
    },
    // Sign Up link on login screen
    signUpLink: {
        marginTop: 20,
        paddingVertical: 10,
    },
    signUpLinkText: {
        fontSize: 14,
        color: '#0066CC',
        textDecorationLine: 'underline',
    },
    // Devices Screen Styles
    arrowIcon: {
        fontSize: 18,
        color: '#666666'
    },
    deviceSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20
    },
    devicesContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16
    },
    deviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    deviceItemIcon: {
        fontSize: 24,
        marginRight: 16,
        color: '#0066CC'
    },
    deviceInfo: {
        flex: 1
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333'
    },
    currentDeviceText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2
    },
    deviceCheckContainer: {
        marginLeft: 10
    },
    deviceCheckCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center'
    },
    deviceCheckmark: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    },
});
