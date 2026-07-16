import { CmsSite } from "@/types/cms";

function block(id: string, type: CmsSite["sections"][number]["topics"][number]["subtopics"][number]["blocks"][number]["type"], order: number, title: string, text?: string, url?: string) {
  return { id, type, order, title, text, url };
}

export const cmsSeed: CmsSite = {
  sections: [
    {
      id: "genetico",
      slug: "genetico",
      title: "Genético",
      icon: "🧬",
      summary: "Síndromes y enfermedades genéticas explicadas para familias.",
      order: 1,
      status: "published",
      topics: [
        {
          id: "sindrome-de-turner",
          slug: "sindrome-de-turner",
          title: "Síndrome de Turner",
          summary: "Causa genética, manifestaciones clínicas, perfil neuropsicológico y recomendaciones para casa y escuela.",
          order: 1,
          status: "published",
          subtopics: [
            {
              id: "que-es-turner",
              slug: "que-es",
              title: "¿Qué es?",
              order: 1,
              status: "published",
              blocks: [
                block("b1", "text", 1, "¿Qué es el Síndrome de Turner?", "Explicación para familias con formato simple."),
              ]
            },
            {
              id: "causa-genetica-turner",
              slug: "causa-genetica",
              title: "Causa genética",
              order: 2,
              status: "published",
              blocks: [block("b2", "text", 1, "Causa genética", "Descripción de la causa genética.")]
            },
            {
              id: "manifestaciones-turner",
              slug: "manifestaciones-clinicas",
              title: "Manifestaciones clínicas",
              order: 3,
              status: "published",
              blocks: [block("b3", "text", 1, "Manifestaciones clínicas", "Listado de manifestaciones clínicas.")]
            },
            {
              id: "recomendaciones-turner",
              slug: "recomendaciones",
              title: "Recomendaciones para casa",
              order: 4,
              status: "published",
              blocks: [block("b4", "text", 1, "Recomendaciones para casa", "Sugerencias prácticas para la familia.")]
            },
          ]
        },
        {
          id: "sindrome-x-fragil",
          slug: "sindrome-x-fragil",
          title: "Síndrome X Frágil",
          summary: "Información sobre causa genética, perfil del neurodesarrollo y recomendaciones.",
          order: 2,
          status: "published",
          subtopics: [
            {
              id: "que-es-xfragil",
              slug: "que-es",
              title: "¿Qué es?",
              order: 1,
              status: "published",
              blocks: [block("b5", "text", 1, "¿Qué es?", "Explicación para familias con formato simple.")]
            }
          ]
        },
        {
          id: "sindrome-de-williams",
          slug: "sindrome-de-williams",
          title: "Síndrome de Williams",
          summary: "Contenido por agregar desde el panel administrador.",
          order: 3,
          status: "draft",
          subtopics: []
        },
        {
          id: "cadasil",
          slug: "cadasil",
          title: "CADASIL",
          summary: "Contenido por agregar desde el panel administrador.",
          order: 4,
          status: "draft",
          subtopics: []
        }
      ]
    },
    {
      id: "neuropsicologico",
      slug: "neuropsicologico",
      title: "Neuropsicológico",
      icon: "🧠",
      summary: "Perfiles cognitivos, funciones ejecutivas y aprendizaje.",
      order: 2,
      status: "published",
      topics: [
        {
          id: "funciones-ejecutivas",
          slug: "funciones-ejecutivas",
          title: "Funciones Ejecutivas",
          summary: "Planeación, memoria de trabajo, atención y regulación explicadas para familias.",
          order: 1,
          status: "published",
          subtopics: [
            {
              id: "fe-introduccion",
              slug: "introduccion",
              title: "Introducción",
              order: 1,
              status: "published",
              blocks: [block("b6", "text", 1, "¿Qué son las funciones ejecutivas?", "Explicación para familias con formato simple.")]
            }
          ]
        },
        {
          id: "memoria",
          slug: "memoria",
          title: "Memoria",
          summary: "Tipos de memoria y estrategias de apoyo para casa y escuela.",
          order: 2,
          status: "draft",
          subtopics: []
        },
        {
          id: "atencion",
          slug: "atencion",
          title: "Atención",
          summary: "Cómo funciona la atención y cómo apoyarla en casa.",
          order: 3,
          status: "draft",
          subtopics: []
        },
        {
          id: "lenguaje",
          slug: "lenguaje",
          title: "Lenguaje",
          summary: "Desarrollo del lenguaje y señales de alerta.",
          order: 4,
          status: "draft",
          subtopics: []
        }
      ]
    },
    {
      id: "conductual",
      slug: "conductual",
      title: "Conductual",
      icon: "💚",
      summary: "Estrategias para manejo de conducta, emociones y regulación.",
      order: 3,
      status: "published",
      topics: [
        {
          id: "regulacion-emocional",
          slug: "regulacion-emocional",
          title: "Regulación emocional",
          summary: "Estrategias prácticas para acompañar emociones difíciles en casa.",
          order: 1,
          status: "published",
          subtopics: [
            {
              id: "re-introduccion",
              slug: "introduccion",
              title: "Introducción",
              order: 1,
              status: "published",
              blocks: [block("b7", "text", 1, "¿Qué es la regulación emocional?", "Explicación para familias con formato simple.")]
            }
          ]
        },
        {
          id: "conductas-desafiantes",
          slug: "conductas-desafiantes",
          title: "Conductas desafiantes",
          summary: "Cómo entender y responder a conductas difíciles.",
          order: 2,
          status: "draft",
          subtopics: []
        },
        {
          id: "rutinas",
          slug: "rutinas",
          title: "Rutinas y estructura",
          summary: "Por qué las rutinas ayudan y cómo implementarlas.",
          order: 3,
          status: "draft",
          subtopics: []
        }
      ]
    },
    {
      id: "recursos",
      slug: "recursos",
      title: "Recursos Descargables",
      icon: "📄",
      summary: "Guías, infografías, checklists y materiales en PDF.",
      order: 4,
      status: "published",
      topics: [
        {
          id: "guias-familias",
          slug: "guias-familias",
          title: "Guías para familias",
          summary: "Materiales descargables para acompañamiento en casa.",
          order: 1,
          status: "published",
          subtopics: [
            {
              id: "guia-primer-diagnostico",
              slug: "primer-diagnostico",
              title: "Guía: primer diagnóstico",
              order: 1,
              status: "published",
              blocks: [
                block("b8", "text", 1, "¿Qué hacer cuando llega un diagnóstico?", "Pasos prácticos para familias que acaban de recibir un diagnóstico genético o neurológico."),
                block("b9", "pdf", 2, "Descargar guía en PDF", "", "")
              ]
            }
          ]
        },
        {
          id: "material-escolar",
          slug: "material-escolar",
          title: "Material para la escuela",
          summary: "Recursos pensados para docentes y entorno escolar.",
          order: 2,
          status: "draft",
          subtopics: []
        },
        {
          id: "infografias",
          slug: "infografias",
          title: "Infografías",
          summary: "Material visual de apoyo para familias.",
          order: 3,
          status: "draft",
          subtopics: []
        }
      ]
    },
    {
      id: "grupo-apoyo",
      slug: "grupo-apoyo",
      title: "Grupo de Apoyo",
      icon: "🤝",
      summary: "Próxima reunión, tema, modalidad e inscripción.",
      order: 5,
      status: "published",
      topics: [
        {
          id: "reuniones",
          slug: "reuniones",
          title: "Próxima reunión",
          summary: "Fecha, modalidad, tema e inscripción.",
          order: 1,
          status: "published",
          subtopics: [
            {
              id: "proxima-reunion",
              slug: "proxima-reunion",
              title: "Próxima reunión",
              order: 1,
              status: "published",
              blocks: [block("b10", "note", 1, "Próxima reunión", "Información de la próxima reunión del grupo de apoyo.")]
            }
          ]
        },
        {
          id: "inscripcion",
          slug: "inscripcion",
          title: "Inscripción",
          summary: "Cómo inscribirte al grupo de apoyo.",
          order: 2,
          status: "draft",
          subtopics: []
        }
      ]
    }
  ]
};
