// Get a specific material
router.get('/:materialId', requireAuth, async (req, res) => {
  const { squadId, materialId } = req.params;

  try {
    const material = await prisma.material.findUnique({
      where: {
        id: parseInt(materialId)
      },
      include: {
        stages: {
          orderBy: {
            order: 'asc'
          }
        },
        category: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Transform stages to include properly formatted contents
    const transformedMaterial = {
      ...material,
      stages: material.stages.map(stage => {
        let contents = [];
        try {
          contents = stage.contents ? 
            (typeof stage.contents === 'string' ? JSON.parse(stage.contents) : stage.contents) :
            (stage.content ? JSON.parse(stage.content) : []);
          
          if (!Array.isArray(contents)) {
            contents = [];
          }
          
          contents.sort((a, b) => (a.order || 0) - (b.order || 0));
        } catch (error) {
          console.error('Error parsing stage contents:', error);
          contents = [];
        }

        return {
          ...stage,
          contents
        };
      })
    };

    console.log('Sending transformed material:', {
      id: transformedMaterial.id,
      title: transformedMaterial.title,
      stagesCount: transformedMaterial.stages.length,
      stages: transformedMaterial.stages.map(s => ({
        id: s.id,
        title: s.title,
        contentsCount: s.contents.length
      }))
    });

    res.json(transformedMaterial);
  } catch (error) {
    console.error('Error fetching material:', error);
    res.status(500).json({ 
      error: 'Failed to fetch material',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}); 