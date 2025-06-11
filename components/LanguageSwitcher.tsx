import React from 'react';
import { View, Button } from 'react-native';
import i18n from '../app/i18n'; // điều chỉnh nếu cấu trúc khác
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { t } = useTranslation();

  const changeLanguage = async () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'vi' ? 'en' : 'vi';
    await i18n.changeLanguage(newLang);
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Button title={t('change_language')} onPress={changeLanguage} />
    </View>
  );
}
