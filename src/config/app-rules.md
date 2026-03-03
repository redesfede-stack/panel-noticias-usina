# Antigravity Rules: ADN del Proyecto NewsPanel (Modo Local Directo)

## 🎯 Objetivo Estratégico (Área USINA)
- Sintetizar el procesamiento de datos y metadatos en un **Termómetro de la Agenda**.
- Proporcionar una visión clara del tono informativo para ajustar la comunicación gubernamental.
- Lograr precisión mediante la estandarización rigurosa de criterios, eliminando la subjetividad.

## 🏗️ Estructura de la UMI (Unidad Mínima de Información)
- **Definición**: 1 nota o link equivale a 1 UMI.
- **Campos Obligatorios (Nivel 1 - Auditoría)**: Hora, fecha, provincia, medio, tema, área de gobierno, título, link y cuerpo de la nota.
- **Jerarquía Geográfica**: La **Provincia** es el eje primario. Se usa "Nacional" solo si no hay anclaje territorial específico.
- **Flujo de Proceso**: 
    1. **Nivel 1 (Auditoría)**: Carga de metadatos.
    2. **Nivel 2 (Edición)**: Corroboración, aprobación y publicación de UMIs.
    3. **Nivel 3 (Análisis)**: Valoración numérica y estratégica.

## ⚖️ Escala de Valoración Cuántica (Nivel 3)
- **Criterios de Puntuación**:
    - **+2 (Positivo/Positivo)**: Agenda oficial; menciona directamente al Presidente o Ministros; destaca el rol de Nación.
    - **+1 (Positivo/Neutro)**: Impacto positivo de indicadores o políticas sin personalización extrema.
    - **0 (Neutro)**: Refiere al "Gobierno" genéricamente; temas de agenda pública no oficiales.
    - **-1 (Neutro/Negativo)**: Tono crítico o cuestionamiento indirecto.
    - **-2 (Negativo/Negativo)**: Editorialización crítica al Poder Ejecutivo; datos equivocados; críticas directas al Presidente o Ministros.

## 💻 Implementación Técnica y UI
- **Infraestructura**: Proces