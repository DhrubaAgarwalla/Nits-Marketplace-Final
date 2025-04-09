'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Slider, 
  Button, 
  Paper, 
  CircularProgress,
  Pagination
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import MainLayout from '@/components/MainLayout';
import ItemCard from '@/components/ItemCard';
import { getItems } from '@/services/itemService';
import { Item, ItemCategory, ListingType } from '@/types';

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as ItemCategory | null;
  
  // State for items and loading
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<ItemCategory | ''>( initialCategory || '');
  const [listingType, setListingType] = useState<ListingType | ''>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  
  // Fetch items on initial load and when filters change
  useEffect(() => {
    fetchItems();
  }, [category, listingType, page]);
  
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters = {
        category: category as ItemCategory | undefined,
        listingType: listingType as ListingType | undefined,
        searchQuery: searchQuery || undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 50000 ? priceRange[1] : undefined,
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
      };
      
      const data = await getItems(filters);
      setItems(data);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };
  
  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };
  
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  const handleClearFilters = () => {
    setSearchQuery('');
    setCategory('');
    setListingType('');
    setPriceRange([0, 50000]);
    setPage(1);
  };
  
  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Browse Items
        </Typography>
        
        {/* Search and Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="flex-end">
              {/* Search input */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search items"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    endAdornment: <SearchIcon color="action" />,
                  }}
                />
              </Grid>
              
              {/* Category filter */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ItemCategory | '')}
                    label="Category"
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {Object.values(ItemCategory).map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Listing type filter */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Listing Type</InputLabel>
                  <Select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as ListingType | '')}
                    label="Listing Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {Object.values(ListingType).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type === ListingType.SELL ? 'For Sale' : 
                         type === ListingType.BUY ? 'Wanted' : 'For Rent'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Search button */}
              <Grid item xs={12} md={2}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={<FilterIcon />}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
            
            {/* Price range slider */}
            <Box sx={{ mt: 3 }}>
              <Typography gutterBottom>Price Range (₹)</Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={50000}
                step={500}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">₹{priceRange[0]}</Typography>
                <Button size="small" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
                <Typography variant="body2">₹{priceRange[1]}</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
        
        {/* Items grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', my: 8 }}>
            <Typography color="error">{error}</Typography>
            <Button variant="outlined" onClick={fetchItems} sx={{ mt: 2 }}>
              Try Again
            </Button>
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ textAlign: 'center', my: 8 }}>
            <Typography variant="h6">No items found</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your filters or search query
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {items.map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                  <ItemCard item={item} />
                </Grid>
              ))}
            </Grid>
            
            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination 
                count={10} // This would be calculated based on total items
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Container>
    </MainLayout>
  );
}
